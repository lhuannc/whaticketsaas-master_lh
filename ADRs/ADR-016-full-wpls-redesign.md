# ADR-016 — Redesign completo do frontend para o padrão WPLS (handoff)

**Status**: `🔄 em andamento`
**Fase**: 3 - Frontend
**Prioridade**: 🟠 Alto
**Depende de**: ADR-005 (tokens), ADR-006/007/008/009 (telas)
**Substitui**: re-escopo do ADR-005 (que adiou o Design System completo)

---

## Contexto

ADR-005 foi re-escopado p/ "páginas novas no stack atual" — entregou função mas **não** o visual do handoff (`handoff/WPLS-handoff (1)/wpls/`). Decisão revista: aplicar o **Design System WPLS completo** ao frontend inteiro (React 16 + MUI v4, sem Vite).

**Identidade WPLS (handoff):**
- Fonte **Manrope**
- Marca gradiente `#2a688f → #42b9eb`, WA verde `#25D366`, IG gradiente, LI azul `#0a66c2`
- Cards border-radius 12-16px, sombras suaves tiered
- Light/dark com superfícies `#f4f7fa` / `#0a1018`
- Bolhas de chat: lead (cinza) / operador (gradiente) / AI (gradiente suave + spark)
- Conversation rows, AI cards, status pills, stage dots
- Mobile: bottom-nav (já feito ADR-006), device-frame em telas públicas

**Estratégia:** sobrescrever tema MUI global + refatorar componentes visuais um a um. Sem mudar lógica — só apresentação. Tarefas pequenas, testáveis isoladamente (build limpo a cada uma).

---

## Tarefas

### Base / Tema
- **T-016.1** — Tema MUI global: paleta marca (#2a688f/#42b9eb), Manrope, borderRadius 12, superfícies light/dark — **Status:** `✅ concluído`
- **T-016.2** — Carregar fonte Manrope (Google Fonts no index.html) — **Status:** `✅ concluído`
- **T-016.3** — Expandir `wpls-theme.css`: classes utilitárias (card, sombras, gradientes, bolhas, ai-card, conversation-row) — **Status:** `⬜ pendente`
- **T-016.4** — Overrides MUI globais (Button, Paper, Card, Chip, AppBar) via `theme.overrides`/`props` p/ radius+sombra WPLS — **Status:** `⬜ pendente`

### Layout / Navegação
- **T-016.5** — AppBar (topbar): gradiente marca + logo + busca global estilo handoff — **Status:** `⬜ pendente`
- **T-016.6** — Sidebar/Drawer: itens com ícones WPLS, item ativo com destaque gradiente — **Status:** `⬜ pendente`
- **T-016.7** — MobileBottomNav: estilo handoff (ícones preenchidos, label, indicador ativo) — **Status:** `⬜ pendente`

### Autenticação (públicas)
- **T-016.8** — Login: layout handoff (split/hero, gradiente, card central, Manrope) — **Status:** `⬜ pendente`
- **T-016.9** — Signup: idem Login — **Status:** `⬜ pendente`

### Inbox / Atendimento
- **T-016.10** — ConversationRow (lista de tickets): avatar + canal badge + último msg + unread + AI indicator (padrão handoff) — **Status:** `⬜ pendente`
- **T-016.11** — Chat bubbles: lead (cinza borda) / operador (gradiente) / AI (gradiente suave + ícone spark) — **Status:** `⬜ pendente`
- **T-016.12** — Composer: estilo handoff (input arredondado, botões anexo/áudio/emoji/copilot) — **Status:** `⬜ pendente`
- **T-016.13** — ContactDrawer + CrmPanel: cards WPLS, stage dots, deal value destacado — **Status:** `⬜ pendente`
- **T-016.14** — TicketActionButtons: botões/ícones no padrão (pill estágio, transfer, copilot) — **Status:** `⬜ pendente`

### Telas novas (polir p/ handoff)
- **T-016.15** — Moderation: cards de comentário estilo handoff (spam flag, status, ações inline) — **Status:** `⬜ pendente`
- **T-016.16** — Funnel: colunas + KanbanCard no visual handoff (cor por canal, valor) — **Status:** `⬜ pendente`
- **T-016.17** — Channels: cards de canal com logos/gradientes IG/LI/WA — **Status:** `⬜ pendente`
- **T-016.18** — Management hub: grid de cards estilo handoff — **Status:** `⬜ pendente`
- **T-016.19** — SuperAdmin: tabela tenants + métricas no padrão — **Status:** `⬜ pendente`
- **T-016.20** — IAConfig: tom picker visual (cards Formal/Cordial/Casual) — **Status:** `⬜ pendente`
- **T-016.21** — Flows: lista + editor de nodes com visual de cards/conectores — **Status:** `⬜ pendente`
- **T-016.22** — Profile: header com avatar grande, stats em cards, presença pill — **Status:** `⬜ pendente`

### Dashboard / Demais
- **T-016.23** — Dashboard: cards KPI no padrão WPLS (recharts com cores marca) — **Status:** `⬜ pendente`
- **T-016.24** — Telas legadas (Users, Queues, Tags, Contacts, Settings, Financeiro): herdam tema global; ajustes pontuais — **Status:** `⬜ pendente`

### Público
- **T-016.25** — Landing page (`handoff/Landing.html`) como rota pública `/` deslogado (hero, bento, pricing) — **Status:** `⬜ pendente`

### Validação
- **T-016.26** — Build prod limpo + revisão visual de cada tela (light + dark) — **Status:** `⬜ pendente`

---

## Consequências
- App inteiro adota identidade WPLS sem rewrite de toolchain (continua CRA/React16/MUI4)
- Risco: MUI v4 limita alguns visuais do handoff (gradientes em componentes) — usar `makeStyles` + classes CSS quando preciso
- Tarefas pequenas = build verde incremental, baixo risco de regressão
