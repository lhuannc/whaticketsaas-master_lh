# ADR-002 — Schema DB: suporte multi-canal

**Status**: `✅ concluído`  
**Fase**: 1 - Foundation  
**Prioridade**: 🔴 Crítico  
**Depende de**: ADR-001  
**Bloqueado por**: —  

---

## Código existente relevante

```
Models com campo `channel` JÁ EXISTENTE:
  Ticket.ts     → channel: 'whatsapp' | 'facebook'   (adicionar 'instagram' | 'linkedin')
  Message.ts    → channel: STRING                    (idem)
  Contact.ts    → channel: STRING                    (idem)
  Message.ts    → dataJson: TEXT                     (cobre metadata multi-canal)

Model Whatsapp.ts já tem campos Facebook:
  facebookUserId, facebookUserToken, facebookPageUserId, tokenMeta
  → base para InstagramAccount (mesmo padrão OAuth Meta)

Migrations existentes em:
  backend/src/database/migrations/
  → estudar última migration antes de criar nova (evitar conflito)
```

**Impacto real**: `channel` enum já existe nos 3 models críticos. Trabalho é adicionar `funnelStage`/`dealValue` em Ticket + criar 3 models novos (InstagramAccount, LinkedinAccount, Comment).

---

## Contexto

O schema atual foi desenhado para WhatsApp como único canal. Para suportar Instagram (DMs + Comentários) e LinkedIn (Comentários), precisamos de abstrações de canal no DB.

**Mudanças necessárias:**

| Tabela | Situação | Ação |
|--------|----------|------|
| `Whatsapps` | Canal único (WA) | Renomear/generalizar para `Channels` |
| `Tickets` | Sem campo canal | Adicionar `channel`, `channelId` |
| `Messages` | Estrutura WA-centrica | Adicionar `channelType`, `externalId`, `metadata` |
| `Contacts` | Sem canal/rede | Adicionar `channelType`, `channelProfile` |
| (nova) `InstagramAccounts` | Não existe | Criar modelo |
| (nova) `LinkedinAccounts` | Não existe | Criar modelo |
| (nova) `Comments` | Não existe | Criar modelo para comentários IG/LI |

---

## Decisão

Criar migrations Sequelize aditivas (não destrutivas). Manter compatibilidade com dados existentes. Novo campo `channelType: enum('whatsapp','instagram','linkedin')`.

---

## Tarefas

### T-002.1 — Migration: adicionar `channelType` em `Tickets`
- **Status**: `✅ concluído`
- `channelType: ENUM('whatsapp','instagram','linkedin') DEFAULT 'whatsapp'`
- `channelAccountId: INTEGER` (FK para canal de origem)

### T-002.2 — Migration: adicionar campos em `Messages`
- **Status**: `⬜ pendente`
- `channelType: ENUM('whatsapp','instagram','linkedin')`
- `externalId: STRING` (ID da mensagem na plataforma externa)
- `metadata: JSONB` (payload extra por canal)
- `parentCommentId: INTEGER NULL` (para threads de comentários)

### T-002.3 — Migration: adicionar campos em `Contacts`
- **Status**: `⬜ pendente`
- `channelType: ENUM('whatsapp','instagram','linkedin')`
- `channelProfileUrl: STRING` (URL perfil público)
- `channelUsername: STRING` (handle IG/LI)

### T-002.4 — Criar modelo `InstagramAccount`
- **Status**: `⬜ pendente`
- Campos: `id`, `companyId`, `igUserId`, `igUsername`, `accessToken`, `tokenExpiresAt`, `pageId`, `status`
- Associar a `Company` (tenant)

### T-002.5 — Criar modelo `LinkedinAccount`
- **Status**: `⬜ pendente`
- Campos: `id`, `companyId`, `liOrganizationId`, `liOrganizationName`, `accessToken`, `tokenExpiresAt`, `refreshToken`, `status`
- Associar a `Company` (tenant)

### T-002.6 — Criar modelo `Comment`
- **Status**: `⬜ pendente`
- Campos: `id`, `ticketId`, `contactId`, `channelType`, `externalCommentId`, `postId`, `body`, `mediaUrl`, `likeCount`, `replyCount`, `isSpam`, `isReplied`, `repliedAt`, `createdAt`
- Associar a `Ticket` e `Contact`

### T-002.7 — Atualizar modelos Sequelize existentes
- **Status**: `⬜ pendente`
- `Ticket.ts`: adicionar associations para `Comment`, novo enum `channelType`
- `Message.ts`: novos campos
- `Contact.ts`: novos campos

### T-002.8 — Seeders de teste multi-canal
- **Status**: `⬜ pendente`
- Seeder com tickets WA + IG + LI para ambiente dev
- Seeder com comentários IG de exemplo

---

## Consequências

- Migrations aditivas = zero downtime em dados existentes
- `metadata JSONB` dá flexibilidade para payloads futuros sem nova migration
- Risco: índices em `externalId` precisam de atenção (unique por canal+companyId)
