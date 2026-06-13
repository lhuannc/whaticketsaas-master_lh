# ADR-004 — Integração LinkedIn API (resposta a comentários)

**Status**: `🔄 em andamento`  
**Fase**: 2 - Canais  
**Prioridade**: 🟠 Alto  
**Depende de**: ADR-002  
**Bloqueado por**: LinkedIn Partner Program / app aprovado  

---

## Contexto

O WPLS permite responder a comentários em posts LinkedIn da página da empresa. Isso requer integração com LinkedIn Marketing API (Organization access).

**Escopo da integração:**
- Leitura de comentários em posts de páginas (Organizations)
- Resposta a comentários via API
- Webhook para novos comentários em tempo real

**Permissões LinkedIn necessárias:**
- `r_organization_social` — leitura posts/comentários da organização
- `w_organization_social` — escrita (resposta a comentários)
- `r_1st_connections_size` — básico de perfil
- Acesso via **LinkedIn Marketing Developer Platform** (aprovação necessária)

**Limitações LinkedIn API:**
- Sem webhook nativo para comentários (polling necessário)
- Rate limit: 500 req/dia por membro, 100k req/dia por app
- OAuth 3-legged com tokens de 60 dias
- Acesso a Organization requer que usuário seja admin da página

---

## Decisão

Polling periódico (Bull job a cada 5 min) para buscar novos comentários. OAuth2 3-legged para conectar conta LinkedIn da empresa. Armazenar em modelo `Comment` unificado com Instagram.

---

## Tarefas

### T-004.1 — Registrar App LinkedIn Developer
- **Status**: `⬜ pendente`
- Criar app em linkedin.com/developers
- Solicitar produtos: "Marketing Developer Platform" + "Sign In with LinkedIn"
- Configurar OAuth redirect URI: `/api/linkedin/callback`
- Solicitar aprovação de acesso (pode demorar semanas)

### T-004.2 — Backend: OAuth2 flow para conectar conta LinkedIn
- **Status**: `⬜ pendente`
- `GET /api/linkedin/auth` — redirecionar para LinkedIn OAuth
- `GET /api/linkedin/callback` — troca code por access_token + refresh_token
- Salvar em `LinkedinAccount` (companyId, organizationId, tokens)
- Refresh automático com `refresh_token` (válido 365 dias)

### T-004.3 — Backend: LinkedinService — buscar posts da organização
- **Status**: `⬜ pendente`
- `getOrganizationPosts(organizationId)` — GET `/v2/ugcPosts`
- Paginar e armazenar IDs dos últimos N posts (cache Redis)
- Base para polling de comentários

### T-004.3b — Criar `FindOrCreateTicketServiceLinkedin` com regras preservadas
- **Status**: `⬜ pendente`
- Clonar padrão de `FindOrCreateTicketServiceMeta.ts` para LinkedIn
- **Regra obrigatória**: recontato via LI → **reabrir ticket fechado** com `userId = null` + `status = pending` (não criar novo)
- Só cria ticket novo se não existir ticket anterior para aquele contato+company
- Fechar ticket limpa operador (`userId = null`, `queueId = null`) — herdado de `UpdateTicketService.ts:139`, sem alteração necessária

### T-004.4 — Backend: Bull Job — polling de comentários LinkedIn
- **Status**: `⬜ pendente`
- Job `linkedin-comment-poll` a cada 5 minutos
- Para cada `LinkedinAccount` ativa, buscar comentários nos posts recentes
- GET `/v2/socialActions/{ugcPostUrn}/comments`
- Deduplicar por `externalCommentId` antes de salvar
- Criar `Comment` + `Ticket` para comentários novos

### T-004.5 — Backend: LinkedinService — responder comentário
- **Status**: `⬜ pendente`
- `replyToComment(commentUrn, organizationUrn, text)` — POST `/v2/socialActions/{commentUrn}/comments`
- Marcar `Comment.isReplied = true`, `Comment.repliedAt = now()`
- Mapear resposta para `Message` interno

### T-004.6 — Backend: LinkedinService — reagir a comentário (like)
- **Status**: `⬜ pendente`
- `likeComment(commentUrn)` — POST `/v2/reactions`
- Ação rápida na tela de moderação

### T-004.7 — Frontend: Tela Canais Management — conectar LinkedIn
- **Status**: `⬜ pendente`
- Botão "Conectar LinkedIn" → popup OAuth
- Exibir nome da organização conectada + status do token
- Dropdown para selecionar qual organização (caso membro de múltiplas)

### T-004.8 — Frontend: Tela Moderação — tab LinkedIn
- **Status**: `⬜ pendente`
- Tab "LinkedIn" na tela de Comentários (junto com Instagram)
- Lista de comentários com avatar, texto, post de origem
- Botão "Responder" abre composer inline
- Botão "Curtir" (reação rápida)
- Badge LI nos tickets da inbox

### T-004.9 — Testes de integração
- **Status**: `⬜ pendente`
- Mock de resposta API LinkedIn com comentários de teste
- Teste deduplicação no polling
- Teste envio resposta a comentário

---

## Consequências

- **Positivo**: Equipe de marketing responde comentários LinkedIn direto no WPLS, sem sair da ferramenta
- **Negativo**: Sem webhooks = polling = delay de até 5 min para novos comentários
- **Risco**: Aprovação LinkedIn Marketing Developer Platform é difícil de obter sem parceria
- **Plano B**: Se aprovação demorar, implementar com scraping via Puppeteer (não recomendado para produção)
