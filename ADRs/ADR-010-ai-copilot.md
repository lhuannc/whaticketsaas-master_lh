# ADR-010 — AI Copilot: sugestões, tom, resumo

**Status**: `⬜ pendente`  
**Fase**: 4 - Features  
**Prioridade**: 🟡 Médio  
**Depende de**: ADR-005, ADR-007  
**Bloqueado por**: —  

---

## Contexto

O WPLS tem um AI Copilot integrado ao chat do operador. Funções: sugerir resposta baseado no histórico, corrigir tom da mensagem redigida, resumir conversa longa. O WhaTicket atual não tem nenhuma funcionalidade de AI.

**Modelo de AI**: a configurar (OpenAI GPT-4o, Anthropic Claude, ou modelo self-hosted). Backend precisa de uma camada de abstração.

---

## Decisão

Criar serviço `AiService` no backend que abstrai o provedor de AI. Frontend consome via API REST (não streaming por enquanto — simplifica a implementação inicial). Configuração do provedor e chave API por tenant.

---

## Tarefas

### T-010.1 — Backend: `AiService` abstrato
- **Status**: `⬜ pendente`
- Interface: `complete(messages, systemPrompt, options)` → `string`
- Implementação inicial: OpenAI GPT-4o
- Configuração via `.env`: `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL`
- Por tenant: `Company.aiTone`, `Company.aiPersona` (campos do ADR-009)

### T-010.2 — Backend: endpoint `POST /api/ai/suggest`
- **Status**: `⬜ pendente`
- Recebe: `ticketId`, `action: 'suggest'|'correct'|'summarize'`, `draft?: string`
- Para `suggest`: lê últimas N mensagens do ticket, gera sugestão de resposta
- Para `correct`: recebe `draft`, reescreve no tom configurado
- Para `summarize`: resume o histórico da conversa
- Rate limit por tenant (evitar abuso)

### T-010.3 — Backend: base de conhecimento no contexto AI
- **Status**: `⬜ pendente`
- Ao gerar sugestão, incluir trechos relevantes da base de conhecimento (RAG básico)
- Busca por similaridade simples (palavra-chave) — pode evoluir para embeddings depois
- Documentos da base: `Company.knowledgeBase` (array de chunks de texto)

### T-010.4 — Frontend: Copilot button no composer
- **Status**: `⬜ pendente`
- Ícone spark (✨) no composer
- Abre Copilot panel/drawer
- Loading state durante chamada AI

### T-010.5 — Frontend: card de sugestão AI
- **Status**: `⬜ pendente`
- Texto da sugestão com animação de fade-in
- Botão "Usar resposta" → copia para o composer
- Botão "Descartar"
- Indicador de tom usado (Formal/Cordial/Casual)

### T-010.6 — Frontend: correção de tom inline
- **Status**: `⬜ pendente`
- Operador escreve mensagem → botão "Corrigir tom" aparece
- Chama `POST /api/ai/suggest` com `action: 'correct'` e `draft`
- Exibe versão corrigida ao lado do draft original
- "Substituir" ou "Manter original"

### T-010.7 — Frontend: resumo da conversa
- **Status**: `⬜ pendente`
- Botão "Resumir" no header do chat
- Exibe popup com resumo em bullet points
- "Copiar para notas" salva como nota interna no ticket

### T-010.8 — Configuração de tom por tenant (Management)
- **Status**: `⬜ pendente`
- Já coberto por T-009.6 (tela IA Management)
- Aqui: implementar leitura do `Company.aiTone` no `AiService`

---

## Consequências

- AI Copilot reduz tempo de resposta do operador
- Abstração do provedor permite trocar de OpenAI → Anthropic sem mudar frontend
- Risco: custo de API AI pode escalar com volume — implementar rate limit por tenant desde o início
- RAG simples por palavra-chave é suficiente para MVP; embeddings podem ser adicionados depois
