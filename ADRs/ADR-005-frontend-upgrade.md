# ADR-005 — Frontend: React 16 → 18 + Vite + Design System WPLS

**Status**: `⬜ pendente`  
**Fase**: 3 - Frontend  
**Prioridade**: 🟠 Alto  
**Depende de**: —  
**Bloqueado por**: —  

---

## Contexto

Frontend atual usa React 16.13 + Create React App (CRA) + Material-UI 4. O handoff WPLS usa React 18 + CSS puro com design tokens. A migração precisa modernizar o toolchain e adotar o novo sistema de design sem perder funcionalidades existentes.

**Problemas do stack atual:**
- CRA está deprecated (sem manutenção)
- React 16 sem Concurrent Features (transitions, Suspense melhorado)
- Material-UI 4 tem divergência visual do novo design
- Sem TypeScript no frontend (backend tem, frontend não)

---

## Decisão

Migrar para Vite + React 18 + TypeScript. Manter Material-UI como base mas sobrescrever com tokens de design WPLS (não substituir completamente MUI de uma vez). Migração incremental — novas telas usam novo design, telas antigas recebem update progressivo.

---

## Tarefas

### T-005.1 — Setup novo projeto frontend com Vite + React 18 + TS
- **Status**: `⬜ pendente`
- `npm create vite@latest frontend-v2 -- --template react-ts`
- Configurar aliases `@/` para `src/`
- Configurar proxy para backend no `vite.config.ts`
- Migrar `.env` para `VITE_` prefix

### T-005.2 — Implementar Design System WPLS (tokens CSS)
- **Status**: `⬜ pendente`
- Criar `src/styles/theme.css` baseado no `handoff/theme.css`
- Tokens: `--brand-deep`, `--brand-bright`, `--brand-grad`, `--wa-green`, `--ig-grad`
- Escala de sombras, border-radius, espaçamento
- Suporte light/dark com `[data-theme="dark"]`
- Hook `useTheme()` com persistência localStorage `ocp-theme`

### T-005.3 — Migrar contextos React (AuthContext, SocketContext, etc.)
- **Status**: `⬜ pendente`
- Reescrever em TypeScript com tipos explícitos
- Manter mesma API pública dos contextos para não quebrar páginas existentes

### T-005.4 — Migrar serviços de API (Axios client)
- **Status**: `⬜ pendente`
- Criar `src/services/api.ts` tipado
- Manter interceptors de auth (JWT)
- Adicionar tipos de response para endpoints existentes

### T-005.5 — Migrar React Router 5 → 6
- **Status**: `⬜ pendente`
- `Switch` → `Routes`, `Route component` → `element`
- Manter mesmas rotas para não quebrar bookmarks
- Adicionar lazy loading com `React.lazy` + `Suspense`

### T-005.6 — Criar biblioteca de componentes base
- **Status**: `⬜ pendente`
- `Avatar` — iniciais + badge de canal (WA/IG/LI)
- `ChannelBadge` — ícone colorido por canal
- `StatusPill` — chip ok/warn/bad
- `CardBase` — card com border/shadow do design system
- `SwitchToggle` — iOS-style com verde `#16a34a`
- `ThemeToggle` — ícone sol/lua

### T-005.7 — Configurar i18n existente no novo setup
- **Status**: `⬜ pendente`
- Migrar `translate/` com i18next para Vite
- Manter pt-BR como padrão

### T-005.8 — Validar build e deploy scripts
- **Status**: `⬜ pendente`
- `vite build` gera `dist/`
- Validar Nginx serve do `dist/` com SPA fallback
- Atualizar Dockerfile frontend se existir

---

## Consequências

- Vite = hot reload 10x mais rápido que CRA
- TypeScript no frontend = menos bugs de integração com backend tipado
- Migração incremental = nenhuma quebra de produção durante a transição
- Risco: React Router 6 tem breaking changes significativos nas rotas aninhadas
