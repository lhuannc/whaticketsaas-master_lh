# Análise do Projeto WhaTicket SaaS e Execução em Localhost

Este documento apresenta uma análise detalhada da estrutura atual do projeto **WhaTicket SaaS** (versão com Kanban e Modo Noturno) e define os requisitos, configurações e passos necessários para executá-lo em ambiente local (`localhost`).

---

## 1. Estrutura Geral do Projeto

O WhaTicket SaaS é uma aplicação web de atendimento multicanal dividida em dois componentes principais (monorepo/multirepo conceitual):

1. **Backend** (`/backend`):
   - Desenvolvido em **TypeScript** e **Node.js** com framework **Express**.
   - Utiliza **Sequelize** como ORM para comunicação com o banco de dados.
   - Utiliza **Bull** (baseado em **Redis**) para gerenciamento de filas de tarefas (mensagens, campanhas, etc.).
   - Utiliza a biblioteca `@whiskeysockets/baileys` para integração direta com a API do WhatsApp via protocolo WebSocket.

2. **Frontend** (`/frontend`):
   - Desenvolvido em **React** (utilizando `react-scripts` v3.4.3 e React v16.13.1).
   - Estilização baseada em **Material-UI** (v4) e componentes customizados.

---

## 2. Requisitos para Rodar Localmente (Localhost)

Para rodar a aplicação com sucesso em sua máquina local, você precisará dos seguintes serviços ativos:

### A. Dependências de Software (Ambiente)
- **Node.js**: Recomenda-se utilizar a versão **16** ou **18** (LTS). Versões mais recentes (como Node 20+) podem apresentar incompatibilidades com dependências mais antigas do React e do compilador do backend.
- **Gerenciador de Pacotes**: `npm` (incluso no Node.js).
- **Banco de Dados**: **PostgreSQL** (padrão configurado no exemplo) ou **MySQL** (suportado pelo Sequelize).
- **Redis**: Necessário para o funcionamento das filas do Bull (responsáveis pelo envio de mensagens em segundo plano).

---

## 3. Configurações Recomendadas para o Ambiente Local

Para facilitar a inicialização dos serviços necessários (PostgreSQL e Redis) sem a necessidade de instalações manuais complexas no sistema operacional, a melhor prática é utilizar o **Docker Compose**.

### Configuração do `docker-compose.yml` na Pasta `/infra`
Criamos o arquivo `docker-compose.yml` dentro de uma pasta dedicada chamada `/infra` para subir o banco de dados e o Redis rapidamente:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: whaticket_postgres
    restart: always
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: whaticket_user
      POSTGRES_PASSWORD: whaticket_pass
      POSTGRES_DB: whaticket_db
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: whaticket_redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

---

## 4. Passo a Passo de Execução

### Passo 1: Inicialização dos Serviços (PostgreSQL e Redis)
Caso opte pelo Docker Compose:
1. Abra o terminal na pasta `infra` do projeto.
2. Execute o comando: `docker-compose up -d`

### Passo 2: Configuração e Execução do Backend
1. **Acessar o diretório**:
   ```bash
   cd backend
   ```
2. **Instalar as dependências**:
   ```bash
   npm install
   ```
3. **Configurar as variáveis de ambiente**:
   Copie o arquivo `.env.example` para `.env` e preencha com as configurações locais:
   ```env
   NODE_ENV=development
   BACKEND_URL=http://localhost
   FRONTEND_URL=http://localhost:3000
   PORT=8080
   PROXY_PORT=8080

   DB_DIALECT=postgres
   DB_HOST=localhost
   DB_PORT=5433
   DB_USER=whaticket_user
   DB_PASS=whaticket_pass
   DB_NAME=whaticket_db

   JWT_SECRET=kZaOTd+YZpjRUyyuQUpigJaEMk4vcW4YOymKPZX0Ts8=
   JWT_REFRESH_SECRET=dBSXqFg9TaNUEDXVp6fhMTRLBysP+j2DSqf7+raxD3A=

   REDIS_URI=redis://127.0.0.1:6379
   REDIS_OPT_LIMITER_MAX=1
   REDIS_OPT_LIMITER_DURATION=3000

   USER_LIMIT=10000
   CONNECTIONS_LIMIT=100000
   CLOSED_SEND_BY_ME=true
   ```
4. **Compilar o Backend**:
   Como as migrations e seeders do Sequelize estão configuradas para ler a pasta compilada (`dist/`), é **obrigatório** compilar o TypeScript antes de migrar:
   ```bash
   npm run build
   ```
5. **Executar as Migrations e Seeds** (Estrutura e dados padrão do banco de dados):
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
6. **Iniciar o Backend em modo de Desenvolvimento**:
   ```bash
   npm run dev:server
   ```

---

### Passo 3: Configuração e Execução do Frontend
1. **Acessar o diretório**:
   ```bash
   cd ../frontend
   ```
2. **Instalar as dependências**:
   ```bash
   npm install
   ```
3. **Configurar as variáveis de ambiente**:
   Copie o arquivo `.env.example` para `.env` e ajuste para apontar para o backend local:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8080
   REACT_APP_HOURS_CLOSE_TICKETS_AUTO=24
   ```
4. **Iniciar o Frontend**:
   ```bash
   npm start
   ```
   *Nota: O frontend abrirá automaticamente no navegador em `http://localhost:3000`.*

---

## 5. Mudanças Necessárias e Pontos de Atenção

### 1. Incompatibilidades de Node.js e Dependências
Muitas bibliotecas no frontend do React 16 e pacotes como `ts-node-dev` no backend podem falhar ao rodar em versões modernas do Node.js (ex: Node v20 ou v22) devido a quebras em compilações nativas (node-gyp, puppeteer, etc.).
- **Solução**: Utilizar **Node.js 18** ou **Node.js 16** localmente. Caso use ferramentas como o `nvm` (Node Version Manager), configure a versão correta do Node antes de rodar os comandos.

### 2. Alerta do README sobre Latência (WhatsApp/Baileys)
O README do projeto avisa sobre possíveis problemas de conexão local ("*não funciona em localhost ou servidor local, com ping muito baixo*"). 
- **Explicação**: Às vezes, o baileys pode sofrer desconexões rápidas se houver gargalos de tempo de resposta ou de cache DNS locais. 
- **Mitigação**: Geralmente isso é contornado ajustando configurações de reconexão ou garantindo que o banco de dados local não sofra gargalos de performance. Durante nossos testes locais, monitoraremos se ocorrem quedas na conexão com o QR Code.

### 3. Configuração do Puppeteer
O backend possui dependência do `puppeteer`, usado em alguns fluxos ou para geração de PDF/sessões. Em ambientes Windows localhost, o Puppeteer baixa automaticamente o Chromium e funciona sem problemas adicionais na maioria das vezes. Caso ocorram erros de inicialização do navegador, precisaremos configurar o parâmetro `--no-sandbox` na inicialização do Puppeteer.

---

## Próximos Passos Recomendados

1. **Configuração de Infraestrutura**: Subir os containers do PostgreSQL e Redis rodando `docker-compose up -d` na pasta `infra`.
2. **Criação do arquivo `docker-compose.yml`** na pasta `/infra`.
3. **Criação dos arquivos `.env`** no backend e no frontend com os valores locais.
4. **Instalação das dependências e primeira execução local** através do script `infra/setup-local.bat`.
