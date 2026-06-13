# ADR-013 — Super Admin multi-tenant portal

**Status**: `⬜ pendente`  
**Fase**: 4 - Features  
**Prioridade**: 🟢 Baixo  
**Depende de**: ADR-009  
**Bloqueado por**: —  

---

## Contexto

O handoff define uma view de Super Admin para gerenciar todos os tenants da plataforma: listar empresas, ver status de assinatura, bloquear/ativar contas, ver métricas de uso. O WhaTicket atual tem controle multi-tenant básico mas sem painel visual de super admin.

**Dados por tenant no handoff:**
- Nome da empresa, plano (Básico/Pro/Enterprise)
- Status: ativo / inadimplente / trial
- Vencimento da fatura
- Valor mensal
- Operadores: usados/limite

---

## Decisão

Role `superAdmin` já existente no backend (verificar). Criar view exclusiva em `/super-admin` acessível apenas para esse role. Reutilizar layout Management mas com switch de contexto.

---

## Tarefas

### T-013.1 — Verificar e consolidar role `superAdmin` no backend
- **Status**: `⬜ pendente`
- Checar middleware de auth existente para role superAdmin
- Garantir que endpoints de listagem de companies só acessem com esse role
- Middleware `isSuperAdmin` explícito nas rotas protegidas

### T-013.2 — Backend: endpoint `GET /api/super-admin/companies`
- **Status**: `⬜ pendente`
- Lista todas as companies com: nome, plano, status, vencimento, operadores, canais ativos
- Suporte a filtro por status e busca por nome
- Paginação

### T-013.3 — Backend: endpoint `PATCH /api/super-admin/companies/:id/status`
- **Status**: `⬜ pendente`
- Ativar / bloquear tenant
- Bloquear: desconecta instâncias Evolution API + marca `Company.status = 'blocked'`
- Emitir aviso ao tenant bloqueado via Socket.io

### T-013.4 — Backend: endpoint de impersonation (opcional)
- **Status**: `⬜ pendente`
- `POST /api/super-admin/impersonate/:companyId` — gera JWT temporário do admin do tenant
- Permite super admin entrar como admin do tenant para suporte
- Logar todas as ações de impersonation em audit log

### T-013.5 — Frontend: switch de contexto Super Admin ↔ Tenant Admin
- **Status**: `⬜ pendente`
- No sidebar Management: botão de role switch (visível apenas para superAdmin)
- Super Admin view mostra tabela de tenants ao invés do management do próprio tenant
- Indicador visual claro "Modo Super Admin" (borda/badge)

### T-013.6 — Frontend: tabela de tenants
- **Status**: `⬜ pendente`
- Colunas: empresa, plano, status badge, vencimento, valor, operadores, ações
- Status badge: ativo (verde) / trial (azul) / inadimplente (vermelho)
- Row menu: Ver detalhes / Bloquear / Ativar / Impersonar
- Ordenar por vencimento (para ver quem vai vencer logo)

### T-013.7 — Frontend: dashboard de métricas super admin
- **Status**: `⬜ pendente`
- Cards: total tenants, ativos, trial, inadimplentes, MRR estimado
- Gráfico de crescimento de tenants (recharts existente)
- Top 5 tenants por volume de mensagens

### T-013.8 — Frontend: modal de detalhes do tenant
- **Status**: `⬜ pendente`
- Canais conectados (WhatsApp instâncias, IG, LI)
- Operadores com presença atual
- Histórico de faturas
- Log de eventos recentes (conexões, erros)

---

## Consequências

- Super admin visual elimina necessidade de queries diretas no banco para suporte
- Impersonation facilita debug em conta de cliente sem expor senha
- Risco: impersonation é sensível — logar tudo com timestamp + IP do super admin no audit log
