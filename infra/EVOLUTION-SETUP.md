# Evolution API — Setup local

WhatsApp provider para WhaTicket. Substitui Baileys direto (ADR-001).

## Subir

```bash
cd infra
docker compose -f docker-compose.evolution.yml up -d
```

Evolution API sobe em `http://localhost:8081`.

## Configurar backend

No `backend/.env`:

```
EVOLUTION_API_URL=http://localhost:8081
EVOLUTION_API_KEY=change-me-evolution-key   # mesma de AUTHENTICATION_API_KEY no compose
```

> A chave `EVOLUTION_API_KEY` do backend **deve** ser igual a `AUTHENTICATION_API_KEY` do compose. Sobrescreva o default antes de subir em qualquer ambiente exposto.

## Como funciona

1. WhatsApp criado no WhaTicket com `provider = "evolution"` → `StartWhatsAppSessionEvolution` cria instância via REST
2. Nome da instância: `company{companyId}-wa{whatsappId}` (em `Whatsapp.evolutionInstanceName`)
3. Webhook configurado por instância → `POST {BACKEND_URL}/webhook/evolution`
4. Eventos tratados: `messages.upsert`, `connection.update`, `qrcode.updated` (ver `EvolutionWebhookController.ts`)
5. Envio: `SendWhatsAppMessageEvolution` / `SendWhatsAppMediaEvolution`

## Verificar

```bash
curl -H "apikey: change-me-evolution-key" http://localhost:8081/instance/fetchInstances
```

## Migração Baileys → Evolution

Instâncias existentes (`provider = "stable"`) continuam usando Baileys. Para migrar uma conexão:
1. Editar Whatsapp, setar `provider = "evolution"`
2. Reconectar — gera nova instância Evolution + novo QR Code
3. `Baileys.ts` model pode ser arquivado após migrar todas as conexões
