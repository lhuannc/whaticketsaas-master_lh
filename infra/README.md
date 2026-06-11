# Infraestrutura e Scripts Locais (/infra)

Esta pasta centraliza os arquivos de infraestrutura (banco de dados e cache) em Docker e os scripts de automação para executar o **WhaTicket SaaS** em ambiente de desenvolvimento local (`localhost`).

---

## Por Que Utilizar Esta Estrutura?

1. **Praticidade e Isolamento (Docker)**: 
   O banco de dados (**PostgreSQL**) e o sistema de filas (**Redis**) rodam isolados em containers Docker. Isso evita que você precise instalar e configurar esses serviços manualmente no seu sistema operacional Windows.
   
2. **Desenvolvimento Rápido no Host**: 
   A aplicação em si (backend e frontend) roda diretamente na sua máquina local. Isso garante:
   - Compilações e *hot-reloads* mais rápidos.
   - Logs de erro limpos e legíveis diretamente em janelas do terminal.
   - Facilidade para rodar depuradores (debuggers) caso necessário.

3. **Automação Completa**: 
   Você não precisa rodar manualmente os comandos de instalação de pacotes, compilação de TypeScript e migração de banco. Os scripts em lote (`.bat`) fazem tudo isso automaticamente.

---

## Pré-requisitos

Antes de iniciar, garanta que você possui instalado em sua máquina:
1. **Node.js**: Recomenda-se a versão **16** ou **18** (para manter compatibilidade com as dependências do projeto).
2. **Docker Desktop**: Deve estar instalado e **em execução** no seu Windows.

---

## Como Executar

A execução é dividida em duas etapas simples:

### 1. Configuração Inicial (Apenas na primeira vez)
Dê dois cliques no arquivo:
👉 **`setup-local.bat`**

**O que ele faz:**
- Sobe os containers do PostgreSQL e Redis no Docker.
- Cria os volumes persistentes para que você não perca os dados ao fechar os containers.
- Instala os pacotes (`node_modules`) no backend e no frontend.
- Compila os arquivos TypeScript do backend.
- Cria a estrutura de tabelas (migrations) e insere as configurações padrão (seeders) no banco.

---

### 2. Inicialização Diária (Para rodar o projeto no dia a dia)
Dê dois cliques no arquivo:
👉 **`start-local.bat`**

**O que ele faz:**
- Garante que os containers Docker estão iniciados.
- Abre um terminal dedicado para o **Backend** executando `npm run dev:server`.
- Abre um terminal dedicado para o **Frontend** executando `npm start` (que abrirá a aplicação em seu navegador automaticamente).

---

## Portas e URLs Locais

- **Frontend**: `http://localhost:3000`
- **Backend (API)**: `http://localhost:8080`
- **Banco de Dados (Postgres)**: `localhost:5433` (Usuário: `whaticket_user` / Senha: `whaticket_pass` / Base: `whaticket_db`)
- **Fila/Cache (Redis)**: `redis://127.0.0.1:6379`
