# ADR-001 — Migrar WhatsApp: Baileys → Evolution API

**Status**: `🔄 em andamento`  
**Fase**: 1 - Foundation  
**Prioridade**: 🔴 Crítico  
**Depende de**: —  
**Bloqueado por**: —  

---

## Código existente relevante

```
backend/src/services/WbotServices/
  StartWhatsAppSession.ts   ← PONTO DE TROCA PRINCIPAL (inicializa Baileys hoje)
  wbotMessageListener.ts    ← substituir por webhook handler
  SendWhatsAppMessage.ts    ← substituir por HTTP call Evolution API
  SendWhatsAppMedia.ts      ← substituir por HTTP call Evolution API
backend/src/models/Whatsapp.ts
  provider: STRING          ← campo já existe! Adicionar valor 'evolution'
  token: STRING             ← pode servir como evolutionApiInstanceToken
backend/src/models/Baileys.ts  ← pode ser arquivado após migração
```

**Impacto real**: não é reescrita total — são 4 arquivos de serviço para substituir + 1 migration pequena.

---

## Contexto

O projeto atual usa `@whiskeysockets/baileys 6.5.0` diretamente no backend para conexão WhatsApp. A WPLS Omnichannel Plus usa **Evolution API** como camada de integração — um servidor REST separado que gerencia sessões WhatsApp e expõe webhooks/websockets padronizados.

**Problemas com Baileys direto:**
- Manutenção interna de sessões (arquivos locais / Redis)
- Atualização de versão quebra integração frequentemente
- Sem painel de gerenciamento de instâncias
- Sem suporte nativo a múltiplas instâncias por tenant

**Vantagens Evolution API:**
- REST API padronizada (POST /message/send, GET /instance)
- Webhooks para eventos (message, connection, qr)
- Suporte a múltiplas instâncias isoladas por tenant
- Painel Admin próprio para status das conexões
- Suporte a Baileys + WhatsApp Business API (Cloud API)

---

## Decisão

Substituir integração Baileys direta por cliente HTTP para Evolution API. Backend vira consumidor de webhooks — não gerencia sessão WhatsApp diretamente.

---

## Tarefas

### T-001.1 — Instalar e configurar Evolution API
- **Status**: `⬜ pendente`
- Subir instância Evolution API (Docker ou standalone)
- Configurar `EVOLUTION_API_URL` e `EVOLUTION_API_KEY` no `.env`
- Criar `docker-compose.evolution.yml` ou documentar setup separado

### T-001.2 — Criar cliente HTTP Evolution API no backend
- **Status**: `✅ concluído`
- Criar `backend/src/libs/evolutionApi.ts`
- Métodos: `createInstance()`, `connectInstance()`, `sendMessage()`, `sendMedia()`, `getQRCode()`, `deleteInstance()`
- Usar Axios com interceptors para auth header `apikey`

### T-001.3 — Migrar modelo `Whatsapp` para suporte Evolution API
- **Status**: `✅ concluído`
- Adicionar campos: `instanceName`, `evolutionApiStatus`, `evolutionApiWebhookToken`
- Migration Sequelize para novos campos
- Manter retrocompatibilidade nos campos existentes

### T-001.4 — Refatorar `WbotServices` para usar Evolution API
- **Status**: `✅ concluído`
- Arquivos alvo: `backend/src/services/WbotServices/`
- Substituir calls Baileys por calls Evolution API client
- Manter mesma interface de serviço para não quebrar controllers

### T-001.5 — Migrar recepção de mensagens: Baileys listener → Webhook
- **Status**: `✅ concluído`
- Criar rota `POST /webhook/evolution/:instanceName`
- Validar token por instância
- Mapear payload Evolution API → formato interno `Message`
- Chamar `FindOrCreateTicketService` existente — **preservar comportamento**:
  - Recontato em ticket fechado → **reabre** com `userId = null` + `status = pending` (não cria novo)
  - Fechar ticket → limpa `userId` e `queueId` via `UpdateTicketService.ts:139`
- Disparar eventos Socket.io existentes

### T-001.6 — Migrar tela QR Code no frontend
- **Status**: `⬜ pendente`
- Adaptar componente QRCode para buscar QR via REST (Evolution API)
- Polling ou webhook para status `CONNECTED` / `DISCONNECTED`

### T-001.7 — Tela Canais no Management: gerenciar instâncias Evolution
- **Status**: `⬜ pendente`
- Novo componente `ChannelWhatsApp` com toggle on/off por instância
- Status visual (verde/amarelo/vermelho) baseado em `evolutionApiStatus`
- Botão "Reconectar" chama `connectInstance()`

### T-001.8 — Testes de integração
- **Status**: `⬜ pendente`
- Teste envio de mensagem texto via Evolution API
- Teste envio de mídia (imagem, áudio, documento)
- Teste reconexão após queda

---

## Consequências

- **Positivo**: Sessões WhatsApp isoladas por tenant, restart sem perder sessão, painel visual
- **Negativo**: Dependência de serviço externo (Evolution API), latência adicional do HTTP hop
- **Risco**: Evolution API tem breaking changes frequentes — fixar versão no docker-compose
