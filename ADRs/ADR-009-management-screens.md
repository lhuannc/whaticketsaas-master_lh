# ADR-009 — Telas Management: canais, equipe, IA, financeiro

**Status**: `⬜ pendente`  
**Fase**: 3 - Frontend  
**Prioridade**: 🟡 Médio  
**Depende de**: ADR-005, ADR-001, ADR-003, ADR-004  
**Bloqueado por**: —  

---

## Contexto

O handoff define telas de administração do tenant em dois layouts: mobile (`Management.html`) e desktop (`Management Desktop.html`). O WhaTicket atual tem páginas de configuração espalhadas. A migração consolida tudo em um hub de management com sidebar/menu.

**Seções do Management:**
1. **Canais** — WhatsApp (Evolution API) + Instagram + LinkedIn
2. **Equipe** — membros, convites, papéis, filas
3. **IA** — tom, persona, base de conhecimento
4. **Financeiro** — plano, pagamento PIX, uso
5. **Configurações** — horários, saudações, auto-close

---

## Decisão

Nova rota `/management` com sidebar fixa. Cada seção é um sub-route (`/management/channels`, `/management/team`, etc.). Reutilizar modais e forms existentes, adaptando para novo design.

---

## Tarefas

### T-009.1 — Layout Management com sidebar
- **Status**: `⬜ pendente`
- Sidebar: logo, menu items com ícones, badge de role (Admin/Super)
- Switch de role (Admin tenant ↔ Super Admin) para superadmins
- CSS baseado em `management-desktop.jsx` e `desktop.css` do handoff
- Mobile: nav horizontal scrollável ou bottom nav adaptado

### T-009.2 — Tela Canais: WhatsApp instances
- **Status**: `⬜ pendente`
- Card por instância Evolution API: nome, status (verde/amarelo/vermelho), número
- Toggle on/off por instância
- Botão "Adicionar WhatsApp" → abre modal com QR Code
- Botão "Reconectar" para instâncias offline
- Baseado em `T-001.7`

### T-009.3 — Tela Canais: Instagram
- **Status**: `⬜ pendente`
- Card conta Instagram conectada: @username, foto, status
- Botão "Conectar Instagram" → OAuth Meta
- Botão "Desconectar"
- Alerta quando token expira em < 7 dias

### T-009.4 — Tela Canais: LinkedIn
- **Status**: `⬜ pendente`
- Card organização LinkedIn conectada: nome, logo, status
- Botão "Conectar LinkedIn" → OAuth LinkedIn
- Seletor de organização (se membro de múltiplas)
- Status do último polling de comentários

### T-009.5 — Tela Equipe
- **Status**: `⬜ pendente`
- Lista de membros: avatar, nome, email, role badge, presença
- Botão "Convidar" → modal com email + role + filas
- Editar role e filas de membro existente
- Remover membro (com confirmação)
- Indicador de membros online (Socket.io)

### T-009.6 — Tela IA (Persona e Base de Conhecimento)
- **Status**: `⬜ pendente`
- Seletor de tom: Formal / Cordial / Casual (visual com preview de texto)
- Campo "Persona": texto livre sobre o assistente (nome, personalidade)
- Upload de arquivos para base de conhecimento (PDF, DOCX, TXT)
- Lista de documentos carregados com botão excluir
- Toggle para habilitar/desabilitar AI por fila

### T-009.7 — Tela Financeiro
- **Status**: `⬜ pendente`
- Card do plano atual: nome, preço, vencimento
- Barra de uso: operadores usados / limite
- Botão "Pagar" → modal PIX (integração GerenciaNet existente)
- Histórico de faturas (link para download PDF)

### T-009.8 — Tela Configurações gerais
- **Status**: `⬜ pendente`
- Horário de atendimento (dias/horas por fila)
- Mensagem de fora do horário
- Auto-close de tickets (horas configurável por fila)
- Saudação automática por canal

---

## Consequências

- Management centralizado melhora UX do administrador
- Risco: tela Canais depende de ADR-001/003/004 estarem implementados — pode ser feita com mocks enquanto APIs não estão prontas
