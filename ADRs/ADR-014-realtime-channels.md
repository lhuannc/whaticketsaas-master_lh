# ADR-014 — Real-time: namespaces Socket.io por canal

**Status**: `⬜ pendente`  
**Fase**: 5 - Infra  
**Prioridade**: 🟡 Médio  
**Depende de**: ADR-001, ADR-003, ADR-004  
**Bloqueado por**: —  

---

## Código existente relevante

```
Frontend já usa rooms por companyId:
  company-${companyId}-user
  company-${companyId}-whatsapp
  company-${companyId}-whatsappSession
  company-${companyId}-auth
  company-${companyId}-settings

→ Padrão de rooms por tenant JÁ IMPLEMENTADO e correto.
→ Trabalho é adicionar novos event types para comentários, canais novos e AI.
```

**Impacto real**: namespacing de tenant está correto. Só adicionar eventos novos — sem refatoração de infraestrutura.

---

## Contexto

O backend atual usa Socket.io com um namespace genérico. Com múltiplos canais (WA + IG + LI + Comentários), precisamos de eventos distintos e isolamento por tenant para evitar vazamento de dados entre companies.

**Eventos necessários (novos ou revisados):**

| Evento | Origem | Descrição |
|--------|--------|-----------|
| `ticket:new` | WA/IG/LI | Novo ticket chegou |
| `ticket:update` | Backend | Status, fila, operador mudou |
| `ticket:funnel-updated` | Backend | Estágio CRM mudou |
| `message:new` | WA/IG/LI | Nova mensagem no ticket |
| `comment:new` | IG/LI | Novo comentário (tela Moderação) |
| `comment:replied` | Backend | Comentário respondido |
| `channel:status` | Evolution/IG/LI | Status de conexão do canal mudou |
| `operator:presence` | Frontend | Operador mudou disponibilidade |
| `ai:suggestion` | Backend | Sugestão AI pronta |

---

## Decisão

Manter namespace único `/` mas adicionar room por `companyId` para isolamento. Revisar eventos para cobrir novos canais. Adicionar tipagem TypeScript nos eventos Socket.io (tanto server quanto client).

---

## Tarefas

### T-014.1 — Tipar eventos Socket.io (server)
- **Status**: `⬜ pendente`
- Criar `backend/src/@types/socket.d.ts` com interface de eventos
- Server-to-client events tipados
- Client-to-server events tipados
- Usar `Socket<ClientEvents, ServerEvents>` no Express

### T-014.2 — Garantir isolamento por companyId (rooms)
- **Status**: `⬜ pendente`
- Ao conectar, operador entra no room `company:{companyId}`
- Todos os `io.emit()` substituídos por `io.to('company:X').emit()`
- Verificar que nenhum evento vaza entre tenants

### T-014.3 — Eventos para comentários (tela Moderação)
- **Status**: `⬜ pendente`
- Emitir `comment:new` quando webhook IG ou polling LI detectar novo comentário
- Emitir `comment:replied` após resposta enviada com sucesso
- Frontend: incrementar badge de pendentes em tempo real

### T-014.4 — Evento de status de canal
- **Status**: `⬜ pendente`
- Evolution API webhook `connection.update` → emitir `channel:status` com `{instanceName, status}`
- IG/LI: emitir quando token renovar ou expirar
- Frontend: atualizar badge de status na tela Canais sem reload

### T-014.5 — Evento de presença de operador
- **Status**: `⬜ pendente`
- `PATCH /api/operators/presence` → emite `operator:presence` para o room
- Desconexão Socket.io → marca operador como offline após 30s (com debounce)
- Frontend: indicador ao vivo na tela de Equipe e no Kanban card

### T-014.6 — Tipar eventos Socket.io (frontend)
- **Status**: `⬜ pendente`
- Criar `frontend/src/services/socket.ts` tipado com os mesmos eventos do server
- Custom hook `useSocket()` que abstrai `socket.on` / `socket.off` com cleanup automático
- Substituir usos diretos de `socket.on` em componentes

### T-014.7 — Heartbeat e reconexão
- **Status**: `⬜ pendente`
- Configurar `pingInterval: 25000`, `pingTimeout: 60000` no servidor
- Frontend: toast "Reconectando..." quando Socket.io perder conexão
- Ao reconectar: re-fetch de tickets/comentários para sincronizar estado perdido

---

## Consequências

- Tipagem dos eventos elimina bugs de nome de evento errado (frequente no projeto atual)
- Rooms por companyId é obrigatório para compliance multi-tenant
- Risco: Socket.io com muitos rooms pode consumir memória — monitorar em produção com pm2/metrics
