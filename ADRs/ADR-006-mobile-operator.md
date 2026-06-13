# ADR-006 — App Operador Mobile (bottom-tab, chat, moderação)

**Status**: `⬜ pendente`  
**Fase**: 3 - Frontend  
**Prioridade**: 🟡 Médio  
**Depende de**: ADR-005, ADR-002  
**Bloqueado por**: —  

---

## Contexto

O handoff define um app mobile para operadores com 4 abas: Conversas, Comentários, Funil e Perfil. A tela atual do WhaTicket é desktop-first sem navegação bottom-tab. Precisamos da versão mobile responsiva baseada nos arquivos `operator-screens.jsx`, `operator.css` e `app.css` do handoff.

---

## Decisão

Implementar como rotas específicas `/app/*` com layout mobile-first. Usar o mesmo backend. Componentes da versão mobile são independentes dos componentes desktop existentes.

---

## Tarefas

### T-006.1 — Layout base mobile: BottomNav + device frame
- **Status**: `⬜ pendente`
- Componente `MobileLayout` com bottom navigation de 4 abas
- Ícones: chat, comment, kanban, user
- Header com logo + presença toggle + notificações
- CSS `app.css` do handoff adaptado

### T-006.2 — Aba Conversas (Inbox mobile)
- **Status**: `⬜ pendente`
- Lista de conversas com `ConversationRow`: avatar, nome, canal badge, último msg, tempo, badge não lidos
- Filtros: Abertas / Pendentes / Resolvidas (chips scrolláveis)
- Busca inline
- Indicador AI por conversa
- Tap → abre chat

### T-006.3 — Tela Chat mobile (thread)
- **Status**: `⬜ pendente`
- Bolhas: lead (cinza) / operador (gradient) / AI (soft gradient + ícone spark)
- Composer: texto + anexo + áudio (mic-recorder existente)
- Botão Copilot (abre bottom sheet)
- Seletor de estágio do funil (pill no topo do chat)
- Back → retorna para inbox

### T-006.4 — Bottom sheet Copilot
- **Status**: `⬜ pendente`
- Ações: "Resumir conversa", "Sugerir resposta", "Corrigir tom"
- Cards de sugestão com botões "Usar" / "Descartar"
- Indicador de tom: Formal / Cordial / Casual

### T-006.5 — Aba Comentários (Moderação mobile)
- **Status**: `⬜ pendente`
- Stream de comentários Instagram + LinkedIn
- Filtro por canal (IG/LI) e status (pendente/respondido/spam)
- Reply inline com campo de texto
- Botão "Converter para DM"
- Botão "Spam" (esconder comentário)

### T-006.6 — Aba Funil (Kanban mobile)
- **Status**: `⬜ pendente`
- 5 estágios: Novo / Qualificado / Proposta / Negociação / Ganho
- Tabs horizontais com count badge por estágio
- Cards de lead: nome, valor, canal, tag
- Tap no card → abre ticket

### T-006.7 — Aba Perfil do Operador
- **Status**: `⬜ pendente`
- Stats: atendimentos hoje, CSAT, tempo médio
- Toggle disponibilidade (online/ausente/offline)
- Link para Management
- Botão logout

### T-006.8 — Responsividade: mobile → desktop
- **Status**: `⬜ pendente`
- Media query 920px+ oculta bottom nav, ativa layout desktop
- CSS baseado em `desktop.css` do handoff

---

## Consequências

- Operadores com celular têm experiência otimizada
- Componentização separada (mobile vs desktop) evita CSS conflitante
- Risco: duplicação de lógica com tela desktop — extrair hooks compartilhados
