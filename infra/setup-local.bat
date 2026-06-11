@echo off
echo ==========================================
echo Iniciando configuracao local do WhaTicket...
echo ==========================================

:: 1. Subir containers no Docker (executado a partir da pasta infra)
echo [1/6] Iniciando Postgres e Redis via Docker Compose...
docker-compose up -d
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao iniciar containers do Docker. Certifique-se de que o Docker Desktop esta aberto.
    pause
    exit /b %ERRORLEVEL%
)

:: Aguardar o banco subir totalmente
echo Aguardando banco de dados inicializar (7 segundos)...
timeout /t 7 /nobreak >nul

:: 2. Instalar dependencias do Backend
echo [2/6] Instalando dependencias do Backend...
cd ../backend
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao instalar dependencias do backend.
    pause
    exit /b %ERRORLEVEL%
)

:: 3. Compilar o Backend
echo [3/6] Compilando o Backend (TypeScript)...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao compilar o backend.
    pause
    exit /b %ERRORLEVEL%
)

:: 4. Executar Migrations do banco
echo [4/6] Executando as migrations do banco de dados...
call npx sequelize db:migrate
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao executar as migrations do banco de dados.
    pause
    exit /b %ERRORLEVEL%
)

:: 5. Executar Seeds (populacao inicial)
echo [5/6] Executando as seeds (configuracao inicial)...
call npx sequelize db:seed:all
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao popular o banco de dados.
    pause
    exit /b %ERRORLEVEL%
)

:: 6. Instalar dependencias do Frontend
echo [6/6] Instalando dependencias do Frontend...
cd ../frontend
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao instalar dependencias do frontend.
    pause
    exit /b %ERRORLEVEL%
)

:: Voltar para a pasta infra
cd ../infra

echo ==========================================
echo Configuração concluida com sucesso!
echo Use start-local.bat para rodar a aplicacao.
echo ==========================================
pause
