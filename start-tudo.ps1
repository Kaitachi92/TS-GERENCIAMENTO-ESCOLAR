# Script único para subir tudo (Windows PowerShell)
# 1. Derruba e remove volumes antigos
# 2. Sobe os containers do zero
# 3. Roda as migrations
# 4. Roda os seeds
# 5. Sobe o frontend

# Garante que o script está na pasta do projeto
Set-Location -Path $PSScriptRoot

Write-Host "Derrubando containers e volumes antigos..."
docker-compose down -v

Write-Host "Subindo containers..."
docker-compose up -d --build

Write-Host "Aguardando banco de dados iniciar..."
Start-Sleep -Seconds 10

Write-Host "Instalando dependências do backend (APP)..."
docker-compose exec backend sh -c "cd APP && npm install"

# Instala node-pg-migrate globalmente no backend
Write-Host "Instalando node-pg-migrate globalmente no backend..."
docker-compose exec backend npm install -g node-pg-migrate

Write-Host "Rodando migrations..."
docker-compose exec backend sh -c "cd /app/APP && node-pg-migrate up"

Write-Host "Rodando seeds..."
docker-compose exec backend sh -c "cd /app/APP && node run-seeds.js"

Write-Host "Subindo frontend (Vite)..."
Set-Location -Path "$PSScriptRoot/frontend"
npm install
npm run dev
Set-Location -Path $PSScriptRoot
Write-Host "Tudo pronto! Backend, banco e frontend rodando."
