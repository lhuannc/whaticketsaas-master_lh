# ADR-003 — Integração Instagram Graph API (DM + Comentários)

**Status**: `🔄 em andamento`  
**Fase**: 2 - Canais  
**Prioridade**: 🟠 Alto  
**Depende de**: ADR-001, ADR-002  
**Bloqueado por**: Conta Meta Business + App aprovado  

---

## Código existente relevante — SCAFFOLDING JÁ PRONTO

```
backend/src/controllers/WebHookMetaController.ts  ← webhook Meta já existe!
backend/src/services/FacebookServices/            ← serviços Facebook/Meta já existem
backend/src/services/TicketServices/FindOrCreateTicketServiceMeta.ts ← lógica Meta pronta
backend/src/routes/ → /webhook/fb                ← rota de webhook já mapeada

frontend/src/pages/Connections/
  → já tem POST /instagram e POST /facebook na UI

Model Whatsapp.ts campos já existentes:
  facebookUserId, facebookUserToken, facebookPageUserId, tokenMeta, channel
  → base para criar InstagramAccount ou reaproveitar Whatsapp com channel='instagram'
```

**Impacto real**: Instagram DMs é provavelmente 60-70% pronto. A parte nova é a moderação de **comentários** (não DMs) — essa sim não existe ainda.

---

## Contexto

A tela de Moderação do WPLS exibe comentários Instagram em posts e permite resposta inline ou conversão para DM. Isso requer integração com Instagram Graph API (via Meta Business Platform).

**Escopo da integração:**
- Instagram Messaging API (DMs — Inbox/Chat normal)
- Instagram Comment Moderation (leitura + resposta a comentários em posts)
- Webhooks Meta para eventos em tempo real

**Permissões Meta necessárias:**
- `instagram_basic`
- `instagram_manage_messages`
- `instagram_manage_comments`
- `pages_manage_metadata`
- `pages_read_engagement`

---

## Decisão

Usar Instagram Graph API v18+ via webhooks Meta Platform. OAuth2 com Facebook Login para conectar conta do tenant. Tokens de longa duração (60 dias) com refresh automático.

---

## Tarefas

### T-003.1 — Registrar App Meta / Facebook Developer
- **Status**: `⬜ pendente`
- Criar app em developers.facebook.com
- Configurar produto "Instagram" e "Messenger"
- Configurar Webhook URL: `POST /webhook/instagram`
- Solicitar permissões avançadas (app review Meta)

### T-003.2 — Backend: OAuth2 flow para conectar conta IG
- **Status**: `⬜ pendente`
- `GET /api/instagram/auth` — redireciona para Meta OAuth
- `GET /api/instagram/callback` — troca code por token, salva em `InstagramAccount`
- Refresh automático de token (cron job a cada 50 dias)

### T-003.3 — Backend: Webhook Meta para DMs Instagram
- **Status**: `⬜ pendente`
- Rota `POST /webhook/instagram` — verificar HMAC-SHA256
- Processar evento `messages` → criar/atualizar `Ticket` + `Message`
- Emitir Socket.io para frontend

### T-003.4 — Backend: Webhook Meta para Comentários Instagram
- **Status**: `⬜ pendente`
- Processar evento `comments` (novo comentário em post)
- Criar `Comment` com `channelType: 'instagram'`
- Criar `Ticket` associado se não existir para o usuário
- Flag `isSpam` baseado em palavras do payload Meta

### T-003.4b — Garantir regras de ticket para canal Instagram
- **Status**: `⬜ pendente`
- **Regra 1 (já existe em `FindOrCreateTicketServiceMeta.ts:50`)**: recontato reabre ticket fechado com `userId = null` + `status = pending` — **manter comportamento, não alterar**
- **Regra 2 (já existe em `UpdateTicketService.ts:139`)**: fechar ticket limpa `userId` e `queueId` — **manter para IG igual ao WA**
- Validar que `FindOrCreateTicketServiceMeta.ts` cobre DMs IG (hoje cobre Facebook — verificar se extensão é necessária para IG puro)

### T-003.5 — Backend: InstagramService — enviar DM
- **Status**: `⬜ pendente`
- `sendInstagramDM(igUserId, message)` — Graph API POST
- Suporte a texto, imagem, sticker
- Mapear response para `Message` interno

### T-003.6 — Backend: InstagramService — responder comentário
- **Status**: `⬜ pendente`
- `replyToComment(commentId, message)` — Graph API POST `/commentId/replies`
- `hideComment(commentId)` — moderar spam
- `convertToDM(commentId)` — criar DM thread para usuário do comentário

### T-003.7 — Frontend: Tela Canais Management — conectar Instagram
- **Status**: `⬜ pendente`
- Botão "Conectar Instagram" → abre popup OAuth
- Status badge (verde/amarelo) para conta conectada
- Mostrar `@username` e `pageId` da conta conectada

### T-003.8 — Frontend: Tela Moderação (Comentários)
- **Status**: `⬜ pendente`
- Lista de comentários por post com filtro (pendentes/respondidos/spam)
- Reply inline com campo de texto + botão enviar
- Botão "Converter para DM"
- Botão "Marcar Spam" (esconde comentário via API)
- Badge de canal IG nos tickets da inbox

### T-003.9 — Testes de integração
- **Status**: `⬜ pendente`
- Teste recepção DM via webhook simulado
- Teste recepção comentário via webhook simulado
- Teste envio resposta DM
- Teste resposta a comentário

---

## Consequências

- **Positivo**: Canal Instagram completo (DM + comentários) num único fluxo de atendimento
- **Negativo**: App Meta precisa de aprovação (pode demorar semanas)
- **Risco**: Tokens expiram em 60 dias — cron job de refresh é crítico
- **Limitação**: Rate limits Meta Graph API (200 req/hora por usuário)
