# WPLS Migration ADRs — WhaTicket → Omnichannel Plus

**Projeto**: WhaTicket SaaS → WPLS Omnichannel Plus  
**Data início**: 2026-06-11  
**Stack atual**: React 16 + Express/TS + Baileys + Material-UI  
**Stack alvo**: React 18 + Express/TS + Evolution API + Design System WPLS  

---

## Análise de Viabilidade (leitura do código)

### O que JÁ EXISTE no projeto (acelera muito a migração)

| Item | Onde existe | Impacto |
|------|-------------|---------|
| `companyId` em todo modelo + JWT | `isAuth.ts` + todos os models | Multi-tenant **100% pronto** — zero trabalho extra |
| Campo `provider` no model `Whatsapp` | `Whatsapp.ts` | Evolution API: só trocar implementação, não schema |
| Campo `channel` em `Ticket`, `Message`, `Contact` | models existentes | Multi-canal: campo já existe, só adicionar enum `instagram/linkedin` |
| `WebHookMetaController.ts` + `FacebookServices/` | `controllers/` + `services/` | Instagram: **scaffolding pronto**, não começa do zero |
| `FindOrCreateTicketServiceMeta.ts` | `services/TicketServices/` | Lógica de ticket por Meta já implementada |
| Campos FB no model `Whatsapp` (`facebookUserId`, `tokenMeta`) | `Whatsapp.ts` | OAuth Meta já foi pensado |
| `GET /tickets/kanban` + `ListTicketsServiceKanban.ts` | routes + services | Kanban: endpoint já existe |
| Campo `kanban` na model `Tag` | `Tag.ts` | Kanban usa tags, não stages — só adicionar `funnelStage` |
| `dataJson TEXT` no model `Message` | `Message.ts` | Cobre `metadata` multi-canal |
| Rooms Socket.io `company-${companyId}-*` | frontend socket | Namespacing por tenant **já implementado** |
| `Setting` key-value por company | `Setting.ts` | Configs Evolution API podem ser salvas aqui direto |

### Resumo de esforço real por ADR

| ADR | Esforço original estimado | Esforço real (com código existente) |
|-----|--------------------------|--------------------------------------|
| ADR-001 Evolution API | Alto | **Médio** — só trocar `StartWhatsAppSession` + listener |
| ADR-002 DB Schema | Alto | **Baixo** — channels existem, adicionar 3 campos + 3 models |
| ADR-003 Instagram | Alto | **Baixo-Médio** — WebhookMeta + FacebookServices já existem |
| ADR-004 LinkedIn | Médio | **Médio** — sem scaffolding, mas padrão Instagram serve de base |
| ADR-005 Frontend upgrade | Alto | **Alto** — React 16 → 18 + CRA → Vite é trabalho real |
| ADR-012 Kanban | Médio | **Baixo** — endpoint + service existem, só UI nova |
| ADR-014 Socket.io | Médio | **Baixo** — rooms já corretos, adicionar event types |

---

## Índice

| ID | Título | Fase | Status |
|----|--------|------|--------|
| [ADR-001](ADR-001-evolution-api.md) | Migrar WhatsApp: Baileys → Evolution API | 1 - Foundation | `✅ concluído` |
| [ADR-002](ADR-002-db-schema-omnichannel.md) | Schema DB: suporte multi-canal | 1 - Foundation | `✅ concluído` |
| [ADR-003](ADR-003-instagram-api.md) | Integração Instagram Graph API (DM + Comentários) | 2 - Canais | `⏸ bloqueado` (código ✅; falta App Meta aprovado) |
| [ADR-004](ADR-004-linkedin-api.md) | Integração LinkedIn API (resposta a comentários) | 2 - Canais | `⏸ bloqueado` (código ✅; falta App LinkedIn aprovado) |
| [ADR-005](ADR-005-frontend-upgrade.md) | Frontend: ~~Vite migration~~ → **re-escopo: tokens WPLS no stack atual** | 3 - Frontend | `✅ concluído` |
| [ADR-006](ADR-006-mobile-operator.md) | App Operador Mobile (bottom-tab + páginas responsivas) | 3 - Frontend | `✅ concluído` |
| [ADR-007](ADR-007-desktop-inbox.md) | Desktop: 3-painéis + CrmPanel/Copilot/Transfer | 3 - Frontend | `✅ concluído` |
| [ADR-008](ADR-008-moderation-screen.md) | Tela Moderação Instagram (comentários inline) | 3 - Frontend | `✅ concluído` |
| [ADR-009](ADR-009-management-screens.md) | Telas Management: hub + canais/equipe/IA/financeiro | 3 - Frontend | `✅ concluído` |
| [ADR-010](ADR-010-ai-copilot.md) | AI Copilot: sugestões, tom, resumo | 4 - Features | `✅ concluído` |
| [ADR-011](ADR-011-flows-editor.md) | Editor de Flows / URA (form-based; canvas descopado React16) | 4 - Features | `✅ concluído` |
| [ADR-012](ADR-012-crm-kanban.md) | CRM Kanban: funil 5 estágios (drag-drop @dnd-kit) | 4 - Features | `✅ concluído` |
| [ADR-013](ADR-013-multitenant-admin.md) | Super Admin multi-tenant portal | 4 - Features | `✅ concluído` |
| [ADR-014](ADR-014-realtime-channels.md) | Real-time: namespaces Socket.io por canal | 5 - Infra | `✅ concluído` |
| [ADR-015](ADR-015-transfer-chat.md) | Transferência de chat para outro número/instância | 2 - Canais | `✅ concluído` |

---

## Regras de negócio imutáveis (preservar em todos os canais)

| Regra | Código fonte | Canais |
|-------|-------------|--------|
| Fechar ticket → remove operador (`userId = null`, `queueId = null`) | `UpdateTicketService.ts:139` | WA + IG + LI |
| Recontato em ticket fechado → **reabre** ticket, zera operador (não cria novo ticket) | `FindOrCreateTicketService.ts:48,80` | WA |
| Idem canal Meta | `FindOrCreateTicketServiceMeta.ts:50,84` | IG DMs |
| LinkedIn → criar `FindOrCreateTicketServiceLinkedin` com mesma lógica | ADR-004 T-003b | LI |

> **Nota**: "novo ticket por recontato" não é o comportamento real — o sistema **reabre** o ticket fechado. Efeito UX é idêntico (operador removido, fila zerada), mas é o mesmo ticket com novo ciclo.

---

## Status Legend

| Símbolo | Significado |
|---------|-------------|
| `⬜ pendente` | Não iniciado |
| `🔄 em andamento` | Em desenvolvimento |
| `✅ concluído` | Implementado e testado |
| `❌ cancelado` | Descartado com justificativa |
| `⏸ bloqueado` | Aguardando dependência |
