# Script único para subir tudo (Windows PowerShell)
# 1. Derruba e remove volumes antigos
# 2. Sobe os containers do zero
# 3. Roda as migrations
# 4. Roda os seeds
# 5. Sobe o frontend

Write-Host "Derrubando containers e volumes antigos..."
docker-compose down -v

Write-Host "Subindo containers..."
docker-compose up -d --build

Write-Host "Aguardando banco de dados iniciar..."
Start-Sleep -Seconds 10

Write-Host "Rodando migrations..."
docker-compose exec backend node run-migrations.js

Write-Host "Rodando seeds..."
docker-compose exec backend node run-seeds.js

Write-Host "Subindo frontend (Vite)..."
Start-Process powershell -ArgumentList 'cd frontend; npm install; npm run dev' -NoNewWindow

Write-Host "Tudo pronto! Backend, banco e frontend rodando."
