@echo off
echo ==========================================
echo Iniciando WhaTicket Local...
echo ==========================================

:: 1. Garantir que os containers Docker estao rodando (executado a partir da pasta infra)
echo Iniciando banco de dados e cache (Docker)...
docker-compose up -d
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Nao foi possivel iniciar os containers Docker.
    pause
    exit /b %ERRORLEVEL%
)

:: 2. Iniciar o Backend em uma nova janela de terminal
echo Iniciando servidor Backend em segundo plano...
start "WhaTicket Backend" cmd /k "cd ../backend && npm run dev:server"

:: 3. Iniciar o Frontend em outra janela de terminal
echo Iniciando servidor Frontend em segundo plano...
start "WhaTicket Frontend" cmd /k "cd ../frontend && set NODE_OPTIONS=--openssl-legacy-provider && npm start"

echo ==========================================
echo A aplicacao esta sendo carregada!
echo - Backend rodando em http://localhost:8080
echo - Frontend rodando em http://localhost:3000
echo ==========================================
echo Mantenha as janelas de terminal abertas.
echo Pressione qualquer tecla para fechar este script.
pause >nul
