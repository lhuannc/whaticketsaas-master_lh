# ADR-011 — Editor visual de Flows / URA (node-based)

**Status**: `⬜ pendente`  
**Fase**: 4 - Features  
**Prioridade**: 🟡 Médio  
**Depende de**: ADR-005, ADR-001  
**Bloqueado por**: —  

---

## Contexto

O handoff define um editor visual de fluxos de atendimento (URA/chatbot) com canvas drag-and-drop. Nodes disponíveis: mensagem, menu de opções, transferir para fila, AI, fim. O WhaTicket atual tem fluxos básicos mas sem editor visual.

**Tipos de node do handoff:**
- `start` — gatilho inicial (palavra-chave, primeiro contato, fora do horário)
- `message` — envia mensagem de texto/mídia
- `menu` — menu de opções numeradas (tipo URA)
- `funnel` — move lead para estágio do funil
- `queue` — transfere para fila/operador
- `ai` — delega para AI Copilot
- `end` — encerra fluxo

---

## Decisão

Usar `React Flow` (biblioteca open-source) para o canvas. Nodes customizados com design do handoff. Persistência dos fluxos como JSON no banco. Execução dos fluxos pelo backend via `FlowExecutorService`.

---

## Tarefas

### T-011.1 — Modelo `Flow` e `FlowNode` no DB
- **Status**: `⬜ pendente`
- `Flow`: id, companyId, name, description, triggerType, triggerValue, channelType, isActive, nodes (JSONB), edges (JSONB)
- Migration Sequelize
- Associar a `Company`

### T-011.2 — Backend: FlowController CRUD
- **Status**: `⬜ pendente`
- `GET /api/flows` — listar fluxos do tenant
- `POST /api/flows` — criar
- `PUT /api/flows/:id` — atualizar (salva JSON completo)
- `DELETE /api/flows/:id`
- `PATCH /api/flows/:id/toggle` — ativar/desativar

### T-011.3 — Backend: FlowExecutorService
- **Status**: `⬜ pendente`
- Ao receber mensagem: verifica se há flow ativo para o canal + gatilho
- Executa node a node (state machine simples)
- Armazena estado de execução no Redis (por `contactId`: nó atual)
- Timeout de sessão de flow (ex: 30 min sem interação = reinicia)

### T-011.4 — Backend: executores por tipo de node
- **Status**: `⬜ pendente`
- `executeMessage()` — envia via canal correto (Evolution/IG/LI)
- `executeMenu()` — envia opções, aguarda resposta, roteia para próximo node
- `executeQueue()` — cria/atualiza ticket com fila alvo
- `executeFunnel()` — atualiza estágio do lead
- `executeAi()` — chama `AiService.complete()` e envia resposta
- `executeEnd()` — limpa estado Redis

### T-011.5 — Frontend: instalar e configurar React Flow
- **Status**: `⬜ pendente`
- `npm install @xyflow/react`
- Canvas base: background grid, mini-map, controles de zoom
- Tema dark/light integrado com design system WPLS

### T-011.6 — Frontend: nodes customizados React Flow
- **Status**: `⬜ pendente`
- `MessageNode` — ícone + título + preview do texto
- `MenuNode` — ícone + opções como lista
- `QueueNode` — ícone + nome da fila
- `FunnelNode` — ícone + estágio alvo
- `AiNode` — ícone spark + label
- `EndNode` — círculo vermelho
- CSS baseado em `flows.css` do handoff

### T-011.7 — Frontend: painel inspector (editar node)
- **Status**: `⬜ pendente`
- Sidebar direita: formulário dinâmico por tipo de node
- `MessageNode`: textarea para texto, upload de mídia
- `MenuNode`: lista de opções com add/remove
- `QueueNode`: dropdown de filas disponíveis
- `FunnelNode`: dropdown de estágios
- Auto-save ao perder foco

### T-011.8 — Frontend: lista de fluxos e toolbar
- **Status**: `⬜ pendente`
- Tela `/management/flows` lista fluxos com status badge
- Botão "Novo Fluxo" → modal de nome + canal + gatilho → abre editor
- Botão "Duplicar" e "Excluir"
- Toggle ativo/inativo por fluxo

### T-011.9 — Testes de execução de flow
- **Status**: `⬜ pendente`
- Simular flow: primeiro contato → menu → transferir para fila
- Simular flow: palavra-chave → resposta AI
- Testar timeout de sessão

---

## Consequências

- Editor visual democratiza criação de fluxos (não precisa programar)
- React Flow é MIT, mantido ativamente, suporta custom nodes complexos
- Risco: React Flow tem curva de aprendizado para nodes complexos com handles múltiplos
- Executar flow sincronamente no webhook handler pode causar timeout — usar Bull job para execução assíncrona
