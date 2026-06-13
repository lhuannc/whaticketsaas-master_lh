# ADR-007 — Desktop: layout 3-painéis (inbox / chat / contexto)

**Status**: `⬜ pendente`  
**Fase**: 3 - Frontend  
**Prioridade**: 🟠 Alto  
**Depende de**: ADR-005, ADR-002  
**Bloqueado por**: —  

---

## Contexto

O handoff define um layout desktop de 3 colunas para o workspace do operador:
- **Esquerda**: lista de conversas com filtros
- **Centro**: thread do chat ativo
- **Direita**: painel de contexto (perfil do lead, valor, ações)

O WhaTicket atual tem uma versão similar mas sem o painel direito de contexto e sem suporte multi-canal visível no layout. Baseado em `Operator Desktop.html` e `desktop.css` do handoff.

---

## Decisão

Refatorar `frontend/src/pages/` para adotar layout 3-colunas com CSS Grid. Reutilizar componentes existentes de chat, adaptando para novo design.

---

## Tarefas

### T-007.1 — Layout Grid 3 colunas (`DesktopLayout`)
- **Status**: `⬜ pendente`
- `grid-template-columns: 320px 1fr 300px`
- Topbar: logo, busca global, toggle presença, tema, avatar usuário
- CSS baseado em `desktop.css` do handoff
- Colapso do painel direito em viewport < 1200px

### T-007.2 — Painel esquerdo: ConversationList desktop
- **Status**: `⬜ pendente`
- Tabs de view (Minhas / Equipe / Todas / Não Atribuídas)
- Filtros: canal (WA/IG/LI), status, fila, operador
- `ConversationRow` com todos os dados do handoff
- Busca com debounce 300ms
- Seleção ativa (highlight na linha)

### T-007.3 — Painel central: ChatPane desktop
- **Status**: `⬜ pendente`
- Header do chat: avatar, nome, canal, status, botões (transferir, fechar, bloquear)
- Thread com scroll infinito (paginar mensagens)
- Bolhas tipadas por canal (WA = verde, IG = gradiente, LI = azul)
- Composer: texto, emoji, anexo, áudio, templates
- Copilot drawer (desliza da direita do painel central)

### T-007.4 — Copilot drawer desktop
- **Status**: `⬜ pendente`
- Sidebar retrátil no painel central (largura 280px)
- Ações: Resumir / Sugerir resposta / Corrigir tom
- Cards de sugestão com streaming de texto (se AI suportar)
- Indicador de tom ativo

### T-007.5 — Painel direito: ContextPane
- **Status**: `⬜ pendente`
- Avatar grande + nome do lead + canal badge
- Valor do deal (editável inline)
- Estágio do funil (dropdown)
- Tags (chips editáveis)
- Informações de contato (telefone, e-mail, username IG/LI)
- Histórico de tickets anteriores (accordion)
- Ações rápidas: agendar, marcar ganho/perdido

### T-007.6 — Presença toggle no topbar
- **Status**: `⬜ pendente`
- Dropdown: Online / Ausente / Offline
- Emite evento Socket.io para atualizar status em tempo real

### T-007.7 — Integração Socket.io no layout desktop
- **Status**: `⬜ pendente`
- Novo ticket → adiciona no topo da lista (sem reload)
- Nova mensagem → atualiza preview da lista + scroll no chat ativo
- Typing indicator no chat pane
- Toast de notificação para tickets de outras filas

---

## Consequências

- Layout moderno equivalente a Intercom/Zendesk/Freshdesk
- Painel de contexto elimina necessidade de abrir outra aba para ver perfil do lead
- Risco: CSS Grid + painéis redimensionáveis pode ser complexo — usar ResizablePanel library se necessário
