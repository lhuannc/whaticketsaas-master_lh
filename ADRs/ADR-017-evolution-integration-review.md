# ADR-017 — Revisão e validação da integração Evolution API

**Status**: `🔄 em andamento`
**Fase**: 1 - Foundation
**Prioridade**: 🔴 Crítico
**Depende de**: ADR-001 (código Evolution)

---

## Contexto

ADR-001 entregou o **código** da integração Evolution API (lib, webhook, send text/media, branching por `provider`, grupos). Mas **nada foi validado ao vivo** — Evolution API nunca subiu, nenhuma conexão `provider="evolution"` foi conectada. Este ADR cobre a revisão ponta-a-ponta + correções que surgirem.

**Estado atual conhecido:**
- Evolution API container: ❌ não está rodando
- DB: 1 whatsapp `provider="beta"`, DISCONNECTED, sem `evolutionInstanceName`
- Código: `evolutionApi.ts`, `StartWhatsAppSessionEvolution.ts`, `EvolutionWebhookController.ts`, `SendWhatsAppMessageEvolution/Media`, branching em `MessageController`/`UpdateTicketService`/`StartAllWhatsAppsSessions`

---

## Tarefas

### Subir e conectar
- **T-017.1** — Subir Evolution API + validar `GET /instance/fetchInstances` com apikey — **Status:** `✅ concluído` (Evolution v2.1.1 em :8081, auth OK)
- **T-017.2** — Conferir `.env`: URL/KEY == compose — **Status:** `✅ concluído`
- **T-017.3** — Criar instância via backend (`provider="evolution"`) — **Status:** `✅ concluído` (instância `company1-wa1` criada)
- **T-017.4** — QR base64 + escanear → CONNECTED — **Status:** `⏸ bloqueado` (QR não entregue; ver Bugs/Pendências)

> **Bugs corrigidos nesta revisão:**
> 1. `createInstance` — Evolution v2 exige `integration:"WHATSAPP-BAILEYS"` + `webhook` como **objeto** (`{url, byEvents, base64, events}`). Schema antigo (flat) dava 400.
> 2. Webhook inalcançável: container Evolution não resolve `localhost` do host. Adicionado `EVOLUTION_WEBHOOK_URL=http://host.docker.internal:8090`. `connection.update` passou a chegar.
>
> **Pendência (T-017.4):** evento `qrcode.updated` não chega ao backend — Evolution loga erro intermitente em `sendData-Webhook` e o Baileys interno fica em loop `connecting/close` sem emitir QR. Investigar: config da instância (CONFIG_SESSION_PHONE_*), timeout do webhook p/ payload grande (base64), ou versão Evolution. Precisa de debug ao vivo + número WhatsApp real.

### Webhook (recebimento)
- **T-017.5** — Validar webhook `messages.upsert` recebe msg de contato direto → cria contact/ticket/message + emite socket — **Status:** `⬜ pendente`
- **T-017.6** — Validar recebimento de **mídia** (imagem/áudio/documento) → download + mediaUrl correto — **Status:** `⬜ pendente`
- **T-017.7** — Validar recebimento em **grupo**: participant vira contato emissor, ticket vincula ao grupo, body correto — **Status:** `⬜ pendente`
- **T-017.8** — Validar segurança do webhook: instância desconhecida ignorada; (TODO) validar token/assinatura por instância — **Status:** `⬜ pendente`

### Envio
- **T-017.9** — Validar envio de **texto** (Evolution `sendText`) + quotedMsg — **Status:** `⬜ pendente`
- **T-017.10** — Validar envio de **mídia** (imagem/doc) e **áudio** (`sendWhatsAppAudio`) — **Status:** `⬜ pendente`
- **T-017.11** — Validar envio para **grupo** (`@g.us`) — **Status:** `⬜ pendente`
- **T-017.12** — Validar mensagens automáticas: saudação, fila (troca), avaliação/encerramento usam Evolution quando `provider="evolution"` — **Status:** `⬜ pendente`

### Regras de negócio (preservar)
- **T-017.13** — Confirmar: fechar ticket remove operador; recontato reabre ticket (não cria novo) também no fluxo Evolution — **Status:** `⬜ pendente`
- **T-017.14** — Confirmar Flow/URA dispara no webhook Evolution (ticket sem fila/operador) — **Status:** `⬜ pendente`

### Resiliência
- **T-017.15** — Reconexão: derrubar/reconectar instância → status atualiza; `StartAllWhatsAppsSessions` reconecta no boot — **Status:** `⬜ pendente`
- **T-017.16** — Transferência de instância (ADR-015) entre conexões Evolution + mensagem de transição — **Status:** `⬜ pendente`

### Limpeza
- **T-017.17** — Decidir destino do Baileys: manter como fallback (`provider="beta"/"stable"`) ou descontinuar; documentar — **Status:** `⬜ pendente`
- **T-017.18** — Revisar tratamento de erro/log do `evolutionApi.ts` (timeouts, retries, status != 2xx) — **Status:** `⬜ pendente`

---

## Consequências
- Sem esta validação, ADR-001 é "código pronto, não comprovado". Só após T-017.* o WhatsApp via Evolution é confiável.
- Requer instância Evolution rodando + número WhatsApp real para escanear QR.
