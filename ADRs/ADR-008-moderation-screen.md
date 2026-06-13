# ADR-008 — Tela Moderação: comentários Instagram + LinkedIn

**Status**: `⬜ pendente`  
**Fase**: 3 - Frontend  
**Prioridade**: 🟡 Médio  
**Depende de**: ADR-003, ADR-004, ADR-005  
**Bloqueado por**: ADR-003, ADR-004  

---

## Contexto

O handoff define uma tela de Moderação dedicada para gerenciar comentários em posts. É separada da inbox de DMs — um operador pode estar respondendo DMs e simultaneamente moderando comentários. Baseado em `operator-screens.jsx` (seção Moderação) e `desktop.css` (layout 2-painéis de moderação).

**Fluxo principal:**
1. Comentário chega via webhook (IG) ou polling (LI)
2. Aparece na tela de Moderação com status "pendente"
3. Operador responde inline, marca spam, ou converte para DM
4. Status atualiza para "respondido"

---

## Decisão

Tela `/moderation` separada da inbox. Compartilha layout desktop (topbar + sidebar) mas conteúdo principal é a lista de comentários. Mobile: aba "Comentários" no bottom nav.

---

## Tarefas

### T-008.1 — Rota e layout da tela Moderação
- **Status**: `⬜ pendente`
- Rota `/moderation` no React Router
- Desktop: layout 2-colunas (lista de posts à esquerda, comentários do post selecionado à direita)
- Mobile: lista única com filtros

### T-008.2 — Componente `CommentRow`
- **Status**: `⬜ pendente`
- Avatar do autor (iniciais + badge canal IG/LI)
- Texto do comentário (truncado com expand)
- Tempo relativo ("5 min atrás")
- Indicador de spam (flag laranja)
- Status badge (pendente / respondido)
- Ações inline: Responder / Spam / Converter DM (IG) / Curtir (LI)

### T-008.3 — Composer de resposta inline
- **Status**: `⬜ pendente`
- Campo de texto expansível sob o comentário (reply thread visual)
- Contador de caracteres (IG: 2200, LI: 1250)
- Botão enviar (desabilitado se vazio)
- Preview da resposta antes de enviar

### T-008.4 — Filtros e busca de comentários
- **Status**: `⬜ pendente`
- Filtro por canal: Todos / Instagram / LinkedIn
- Filtro por status: Pendentes / Respondidos / Spam
- Filtro por post (dropdown)
- Busca por texto do comentário

### T-008.5 — Painel de contexto do post (desktop)
- **Status**: `⬜ pendente`
- Thumbnail do post (imagem/vídeo)
- Caption do post (truncado)
- Métricas: curtidas, comentários, alcance
- Botão "Ver no Instagram/LinkedIn" (link externo)

### T-008.6 — Indicador de volume em tempo real
- **Status**: `⬜ pendente`
- Badge com count de comentários pendentes no ícone da aba/menu
- Atualização via Socket.io ao chegar novo comentário
- Toast "X novos comentários" com link direto

### T-008.7 — Ação "Converter para DM"
- **Status**: `⬜ pendente`
- Modal de confirmação: "Iniciar DM com @usuario?"
- Cria ticket na inbox com tag "origem: comentário"
- Link de volta para o comentário original no ticket

### T-008.8 — Backend: endpoint `GET /api/comments`
- **Status**: `⬜ pendente`
- Parâmetros: `channelType`, `status`, `postId`, `page`, `limit`
- Retorna `Comment[]` com dados do autor
- Ordenar por `createdAt DESC`

### T-008.9 — Backend: endpoint `POST /api/comments/:id/reply`
- **Status**: `⬜ pendente`
- Valida autorização (companyId do operador == dono do canal)
- Chama `InstagramService.replyToComment()` ou `LinkedinService.replyToComment()`
- Atualiza `Comment.isReplied = true`

---

## Consequências

- Moderação de comentários integrada ao fluxo de atendimento
- Operadores não precisam acessar IG/LI diretamente para responder
- Risco: volume alto de comentários em campanhas pode sobrecarregar a tela — implementar virtualização (react-virtual) na lista
