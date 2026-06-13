# ADR-012 — CRM Kanban: funil 5 estágios

**Status**: `⬜ pendente`  
**Fase**: 4 - Features  
**Prioridade**: 🟢 Baixo  
**Depende de**: ADR-005, ADR-002  
**Bloqueado por**: —  

---

## Código existente relevante

```
backend/src/routes/ → GET /tickets/kanban          ← endpoint JÁ EXISTE
backend/src/services/TicketServices/ListTicketsServiceKanban.ts ← service já existe
backend/src/models/Tag.ts → kanban: INTEGER         ← kanban usa número de coluna via Tag
frontend/src/pages/Kanban/                          ← página Kanban já existe
frontend/src/pages/TagsKanban/                      ← variação por tags também existe
```

**Diferença arquitetural importante**: o Kanban atual agrupa tickets por **Tag** (campo `kanban` na Tag). O WPLS usa **funnelStage** como campo direto no Ticket. São abordagens diferentes.

**Decisão**: manter suporte a ambas (Tag-kanban existente + funnelStage novo CRM). Não quebrar o que funciona.

---

## Contexto

O WhaTicket atual tem Kanban via `react-trello` (biblioteca desatualizada). O handoff define um funil CRM de 5 estágios integrado com os tickets: Novo → Qualificado → Proposta → Negociação → Ganho. O estágio aparece no chat (pill), no painel de contexto, e no Kanban como view dedicada.

**5 estágios (WPLS):**
1. `novo` — lead chegou mas não foi qualificado
2. `qualificado` — interesse confirmado
3. `proposta` — proposta enviada
4. `negociacao` — em negociação de termos
5. `ganho` — venda fechada / objetivo atingido

---

## Decisão

Substituir `react-trello` por implementação própria com `@dnd-kit/core` (drag-and-drop moderno, acessível, React 18 compatível). Adicionar campo `funnelStage` em `Ticket`. Kanban desktop como nova view `/kanban`.

---

## Tarefas

### T-012.1 — Migration: campo `funnelStage` em `Tickets`
- **Status**: `⬜ pendente`
- `funnelStage: ENUM('novo','qualificado','proposta','negociacao','ganho') DEFAULT 'novo'`
- `dealValue: DECIMAL(10,2) NULL` — valor do negócio
- Migration Sequelize

### T-012.2 — Backend: endpoint atualizar estágio
- **Status**: `⬜ pendente`
- `PATCH /api/tickets/:id/funnel` com body `{ funnelStage, dealValue? }`
- Emitir evento Socket.io `ticket:funnel-updated` para todos os viewers

### T-012.3 — Backend: endpoint GET tickets por estágio
- **Status**: `⬜ pendente`
- `GET /api/tickets/kanban?funnelStage=novo` (ou `all` para todos os estágios)
- Retorna dados compactos: id, contactName, channel, dealValue, tags, operatorAvatar

### T-012.4 — Frontend: instalar @dnd-kit
- **Status**: `⬜ pendente`
- `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- Remover `react-trello` do package.json

### T-012.5 — Frontend: KanbanBoard desktop
- **Status**: `⬜ pendente`
- Rota `/kanban`
- 5 colunas com header: cor, nome do estágio, count de cards + valor total
- Scroll horizontal quando viewport estreito
- CSS baseado em `desktop.css` (seção kanban) do handoff

### T-012.6 — Frontend: KanbanCard
- **Status**: `⬜ pendente`
- Nome do contato, valor do deal (editável inline), canal badge, tag chips, avatar do operador
- Cor de borda por canal (verde=WA, gradiente=IG, azul=LI)
- Tap/click → abre ticket no chat pane (ou modal em mobile)

### T-012.7 — Frontend: drag-and-drop entre colunas
- **Status**: `⬜ pendente`
- `DndContext` + `SortableContext` por coluna
- `onDragEnd` chama `PATCH /api/tickets/:id/funnel`
- Animação de drop com `@dnd-kit/sortable` transitions
- Otimistic update: move card imediatamente, reverte se API retornar erro

### T-012.8 — Frontend: pill de estágio no chat
- **Status**: `⬜ pendente`
- Pill colorida no topo do ChatPane (desktop) e mobile chat
- Dropdown para mudar estágio sem sair do chat
- Atualiza em tempo real via Socket.io

### T-012.9 — Frontend: Kanban mobile (tab Funil)
- **Status**: `⬜ pendente`
- Tabs horizontais por estágio (como no handoff)
- Lista de cards por estágio ativo (sem drag — toque para mover)
- Botão "Mover para..." no card abre modal com 5 estágios

---

## Consequências

- @dnd-kit é mais leve e moderno que react-trello, sem vendor lock-in
- Valor total por coluna dá visibilidade de pipeline em segundos
- Risco: sincronização em tempo real do kanban com múltiplos operadores pode causar conflitos — "last write wins" é suficiente para MVP
