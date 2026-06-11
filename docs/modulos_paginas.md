# Módulos e Páginas do WhaTicket SaaS

Este documento fornece um mapeamento completo de todas as páginas e módulos do frontend do **WhaTicket SaaS** com Kanban e Modo Noturno, detalhando suas funcionalidades e o propósito de cada componente no fluxo de atendimento.

---

## Sumário das Páginas e Módulos

O frontend está estruturado em **31 diretórios de páginas** na pasta `src/pages/`. A seguir estão as explicações de cada módulo organizado por categoria de funcionamento.

---

## 1. Atendimento e Conversação (Core)

### 📌 [Tickets](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Tickets)
- **Descrição**: O painel central de conversação. É a tela mais utilizada pelos operadores.
- **Funcionalidades**:
  - Chat em tempo real integrado com o WhatsApp.
  - Divisão de abas: "Abertos" (Tickets em atendimento), "Aguardando" (Novos clientes na fila) e "Resolvidos" (Histórico de chats encerrados).
  - Ações do Chat: Enviar texto, emojis, arquivos, áudios gravados no navegador, e transferir atendimentos para outros setores/atendentes.
  - Painel lateral com informações do contato, notas internas e agendamento de tarefas.

### 📌 [Kanban](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Kanban)
- **Descrição**: Módulo de organização visual dos atendimentos utilizando a metodologia Kanban (quadros e colunas arrastáveis).
- **Funcionalidades**:
  - Visualização de tickets em formato de cartões (*cards*).
  - Organização dos cartões em colunas personalizadas (ex: Prospecção, Negociação, Fechado, Pós-Venda).
  - Mudança de status/etapa arrastando o card de uma coluna para a outra (*Drag and Drop*).

### 📌 [TicketResponsiveContainer](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/TicketResponsiveContainer)
- **Descrição**: Contêiner adaptativo focado na responsividade.
- **Funcionalidades**:
  - Otimiza o layout do chat principal de atendimento para dispositivos móveis (tablets e smartphones), permitindo que operadores atendam de qualquer lugar com uma interface limpa.

### 📌 [TicketsAdvanced](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/TicketsAdvanced)
- **Descrição**: Interface avançada de controle de conversas.
- **Funcionalidades**:
  - Filtros refinados de conversas, buscas textuais profundas no histórico de mensagens, e gerenciamento de filas de forma expandida.

### 📌 [TicketsCustom](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/TicketsCustom)
- **Descrição**: Customizações específicas e regras sob medida do fluxo de chats aplicadas a esta versão do WhaTicket.

---

## 2. Disparos em Massa e Campanhas (Marketing/Prospecção)

### 📌 [Campaigns](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Campaigns)
- **Descrição**: Painel de criação e controle de disparos em massa.
- **Funcionalidades**:
  - Criação de campanhas de envio de mensagens para listas pré-definidas.
  - Configuração de agendamento (início da campanha em data/hora específicas).
  - Escolha da conexão de WhatsApp que será usada para realizar os disparos.

### 📌 [CampaignsConfig](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/CampaignsConfig)
- **Descrição**: Configurações de segurança para evitar banimentos no WhatsApp.
- **Funcionalidades**:
  - Ajuste do tempo de intervalo de delay (em segundos) entre uma mensagem e outra.
  - Definição de limites de envios diários.

### 📌 [CampaignReport](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/CampaignReport)
- **Descrição**: Relatório estatístico pós-disparo.
- **Funcionalidades**:
  - Métricas de entrega: quantas mensagens foram enviadas com sucesso, quantas falharam, e percentual de entrega da campanha.

### 📌 [ContactLists](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/ContactLists)
- **Descrição**: Gerenciador de listas de transmissão.
- **Funcionalidades**:
  - Cadastro de grupos/listas de contatos segmentados para usar em campanhas de marketing ou avisos.

### 📌 [ContactListItems](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/ContactListItems)
- **Descrição**: Gerenciador de membros de cada lista de transmissão.
- **Funcionalidades**:
  - Permite adicionar, editar, excluir números de telefone de uma lista, bem como fazer a importação de contatos em lote via arquivo de planilha (geralmente formato `.csv` ou `.xlsx`).

---

## 3. Cadastros e Caderneta de Clientes

### 📌 [Contacts](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Contacts)
- **Descrição**: A agenda global de clientes integrados ao WhaTicket.
- **Funcionalidades**:
  - Exibe e gerencia a lista completa de pessoas que já entraram em contato ou foram cadastradas.
  - Permite adicionar novos contatos manualmente, exportar agenda para Excel, e editar informações (Nome, Email, Telefone, Carteira de Clientes).

### 📌 [Tags](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Tags)
- **Descrição**: Gerenciador de etiquetas (tags) coloridas.
- **Funcionalidades**:
  - Criação de rótulos visuais (ex: "Lead Frio", "Cliente VIP", "Aguardando Pagamento") para categorizar e filtrar contatos e conversas de forma rápida.

### 📌 [TagsKanban](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/TagsKanban)
- **Descrição**: Vinculação entre as etiquetas do sistema e a ordem das colunas no painel Kanban.
- **Funcionalidades**:
  - Define quais tags virarão etapas/raias visuais no quadro Kanban.

---

## 4. Configurações de Atendimento e Rotina

### 📌 [Queues](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Queues)
- **Descrição**: Setores/Departamentos e Chatbot.
- **Funcionalidades**:
  - Criação de filas de atendimento (ex: Suporte, Comercial, Financeiro).
  - Definição do menu inicial do Chatbot automático (URA digital) onde o cliente escolhe a opção desejada para ser direcionado ao setor correto.

### 📌 [QuickMessages](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/QuickMessages)
- **Descrição**: Respostas rápidas / Atalhos de teclado.
- **Funcionalidades**:
  - Cadastro de mensagens padrão frequentes (ex: boas-vindas, dados de PIX, termos de serviço) que podem ser invocadas no chat digitando um atalho rápido (geralmente começando com `/`).

### 📌 [Schedules](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Schedules)
- **Descrição**: Agendamento individual de mensagens.
- **Funcionalidades**:
  - Permite agendar uma mensagem personalizada para ser enviada a um cliente específico no futuro (ex: lembrar um cliente de um vencimento amanhã às 09h).

### 📌 [ToDoList](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/ToDoList)
- **Descrição**: Lista de Tarefas / Agenda Pessoal.
- **Funcionalidades**:
  - Bloco de notas interativo e checklist de tarefas simples para uso interno do operador, facilitando o gerenciamento do seu dia de trabalho diretamente pela aplicação.

---

## 5. Conectividade e Integração

### 📌 [Connections](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Connections)
- **Descrição**: Painel de Conexões e Canais de Comunicação.
- **Funcionalidades**:
  - Onde se faz o emparelhamento com o WhatsApp via leitura de QR Code.
  - Permite visualizar o status da conexão ("Conectado", "Desconectado", "Aguardando QR Code"), reiniciar conexões e adicionar múltiplos números de WhatsApp.

### 📌 [MessagesAPI](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/MessagesAPI)
- **Descrição**: Guia e documentação da API externa.
- **Funcionalidades**:
  - Exibe instruções, tokens e exemplos de código para desenvolvedores integrarem sistemas de terceiros (como ERPs e CRMs) para enviar mensagens automáticas através das conexões do WhaTicket.

---

## 6. Gestão de SaaS e Faturamento

### 📌 [Companies](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Companies)
- **Descrição**: Gerenciador de Empresas Multi-inquilino (*Multi-tenant*).
- **Funcionalidades**:
  - Visível apenas para o Administrador Master do sistema. Permite criar e suspender empresas parceiras (tenants) que utilizam o WhaTicket no formato White Label/SaaS.

### 📌 [Financeiro](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Financeiro)
- **Descrição**: Histórico financeiro e controle de faturas do SaaS.
- **Funcionalidades**:
  - Permite ver as faturas emitidas para a empresa atual, gerar QR Codes PIX para pagamento da mensalidade do sistema e gerenciar cobranças.

### 📌 [Subscription](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Subscription)
- **Descrição**: Gerenciamento de Assinatura e Planos.
- **Funcionalidades**:
  - Tela para visualização do plano ativo, alteração de plano contratado (Upgrade/Downgrade de quantidade de conexões/usuários) e data de vencimento da licença.

---

## 7. Configurações Administrativas e de Sistema

### 📌 [Dashboard](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Dashboard)
- **Descrição**: Painel de Business Intelligence (BI) e estatísticas.
- **Funcionalidades**:
  - Exibe contadores de atendimentos ativos, tempo médio de espera (TME), tempo médio de atendimento (TMA), gráficos de desempenho por atendente e setor.

### 📌 [Users](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Users)
- **Descrição**: Gestão da equipe (Atendentes e Supervisores).
- **Funcionalidades**:
  - Cadastro de novos operadores, definição de cargos (Admin ou Usuário), alteração de senhas e vinculo de quais setores (filas) aquele atendente tem permissão para visualizar.

### 📌 [Settings](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Settings)
- **Descrição**: Configurações gerais de comportamento da empresa.
- **Funcionalidades**:
  - Ajuste de parâmetros como: habilitação de chatbot, obrigatoriedade de avaliação NPS (avaliação do atendente ao finalizar conversa), controle de horário de atendimento, etc.

### 📌 [SettingsCustom](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/SettingsCustom)
- **Descrição**: Configurações avançadas extras integradas neste fork (como limites do Baileys, envio de mensagens repetidas, etc.).

---

## 8. Páginas Públicas e Acesso

### 📌 [Login](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Login)
- **Descrição**: Página de autenticação de usuários cadastrados.

### 📌 [Signup](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Signup)
- **Descrição**: Página de registro para novas empresas criarem suas contas de teste ou iniciarem suas assinaturas.

### 📌 [Annoucements](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Annoucements)
- **Descrição**: Visualização e envio de avisos internos para os operadores logados (ex: aviso de manutenção do sistema).

### 📌 [Helps](file:///c:/projetos/whaticketsaas-master_lh/frontend/src/pages/Helps)
- **Descrição**: Central de vídeos explicativos e tutoriais integrados para facilitar a ambientação dos novos atendentes.
