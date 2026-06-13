# ADR-015 — Transferência de chat para outro número/instância

**Status**: `⬜ pendente`  
**Fase**: 2 - Canais  
**Prioridade**: 🟠 Alto  
**Depende de**: ADR-001  
**Bloqueado por**: —  

---

## Contexto

Operadores precisam transferir uma conversa WhatsApp ativa para:

1. **Outro operador** (já existe via `userId` no `UpdateTicketService`) — manter
2. **Outra instância WhatsApp** (outro número/CNPJ conectado via Evolution API) — novo
3. **Número externo** (encaminhar conversa para um celular fora do sistema) — novo

**Caso de uso principal**: empresa tem múltiplos números WhatsApp (suporte, vendas, financeiro). Operador de suporte recebe ticket e precisa transferir para o número de vendas — o cliente continua a conversa com o número correto.

**Diferença de "transferir operador"**: muda o `whatsappId` do ticket (qual número envia/recebe), não só o `userId`.

---

## Decisão

Três tipos de transferência, todos via modal unificado no ChatPane:
- **Tipo A**: transferir operador (já existe, só UI nova)
- **Tipo B**: transferir instância WA (muda `whatsappId`, envia mensagem de transição pelo número novo)
- **Tipo C**: encaminhar para número externo (envia cópia do histórico para número externo via Evolution API)

---

## Tarefas

### T-015.1 — Backend: endpoint `PATCH /tickets/:id/transfer-instance`
- **Status**: `⬜ pendente`
- Body: `{ targetWhatsappId: number, notifyContact?: boolean, transferMessage?: string }`
- Valida que `targetWhatsappId` pertence ao mesmo `companyId`
- Atualiza `ticket.whatsappId = targetWhatsappId`
- Se `notifyContact = true`: envia `transferMessage` (ou padrão) pelo **novo** número para o contato
- Emite `ticket:updated` via Socket.io

### T-015.2 — Backend: endpoint `POST /tickets/:id/forward`
- **Status**: `⬜ pendente`
- Body: `{ targetNumber: string, includeHistory?: boolean, historyLimit?: number }`
- Valida número via Evolution API `CheckContactNumber`
- Formata histórico das últimas N mensagens como texto
- Envia via Evolution API para `targetNumber` usando instância padrão da company
- Não altera o ticket — é apenas encaminhamento (forward)

### T-015.3 — Backend: `TransferInstanceService`
- **Status**: `⬜ pendente`
- Criar `backend/src/services/TicketServices/TransferInstanceService.ts`
- Lógica: buscar nova instância, verificar `provider` (evolution vs baileys), enviar msg de transição, atualizar ticket
- Usar `SendWhatsAppMessageEvolution` ou `SendWhatsAppMessage` conforme provider da instância alvo

### T-015.4 — Backend: mensagem de sistema no histórico
- **Status**: `⬜ pendente`
- Ao transferir instância: registrar `Message` com `fromMe: true`, `body: "Conversa transferida para [nome da instância]"`, `mediaType: "system"`
- Aparece no chat como bolha de sistema (estilo cinza centralizado)

### T-015.5 — Frontend: modal de transferência unificado
- **Status**: `⬜ pendente`
- Botão "Transferir" no header do ChatPane (desktop) e no menu do chat (mobile)
- Modal com 3 tabs: **Operador** / **Número** / **Encaminhar**
- Tab Operador: lista de operadores disponíveis (já existe, adaptar UI)
- Tab Número: lista de instâncias WhatsApp da company com status (verde/vermelho)
- Tab Encaminhar: campo de número externo + toggle incluir histórico

### T-015.6 — Frontend: seletor de instâncias no modal
- **Status**: `⬜ pendente`
- Buscar `GET /whatsapp` filtrado por `channel: 'whatsapp'` e `status: 'CONNECTED'`
- Card por instância: nome, número, status badge, provider badge (Evolution/Baileys)
- Desabilitar instância atual do ticket
- Ao selecionar: mostrar campo de mensagem de transição (editável, com default)

### T-015.7 — Frontend: feedback visual pós-transferência
- **Status**: `⬜ pendente`
- Após transferência de instância: bolha de sistema aparece no chat com destaque
- Toast: "Conversa transferida para [nome da instância]"
- Se operador transferiu para outro operador: ticket sai da lista (mesma lógica atual)

### T-015.8 — Frontend: transferência mobile
- **Status**: `⬜ pendente`
- Bottom sheet no chat mobile com as mesmas 3 opções
- Fluxo: tap "Transferir" → bottom sheet → selecionar tipo → confirmar

---

## Regras de negócio

| Regra | Comportamento |
|-------|--------------|
| Transferência de instância | Remove operador atual (`userId = null`) — operador da fila do novo número assume |
| Encaminhamento externo | Não altera ticket, não remove operador — apenas copia histórico |
| Instância desconectada | Bloqueado no frontend, backend valida `status === 'CONNECTED'` |
| Multi-tenant | `targetWhatsappId` deve ser da mesma `companyId` — validado no backend |
| Histórico no forward | Máximo 50 mensagens, formato: `[HH:MM] Nome: texto` |

---

## Consequências

- Unifica transferência de operador + instância num único modal — UX consistente
- Encaminhamento externo útil para escalar para especialistas fora do sistema
- Risco: transferência de instância enquanto cliente está digitando pode causar confusão — mensagem de transição mitiga
