# Script para restaurar backup do banco PostgreSQL
param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile
)

$backupDir = "backups"
$fullBackupPath = "$backupDir\$BackupFile"

Write-Host "=== RESTAURAÇÃO DO BANCO DE DADOS ESCOLA ==="
Write-Host "Iniciando restauração em: $(Get-Date)"

# Verifica se o arquivo de backup existe
if (-not (Test-Path $fullBackupPath)) {
    Write-Host "❌ Arquivo de backup não encontrado: $fullBackupPath" -ForegroundColor Red
    Write-Host "`n📁 Backups disponíveis:"
    
    if (Test-Path $backupDir) {
        Get-ChildItem "$backupDir\backup_escola_*.sql" | 
            Sort-Object LastWriteTime -Descending | 
            ForEach-Object { 
                $size = [math]::Round($_.Length / 1KB, 2)
                Write-Host "   $($_.Name) - $size KB - $($_.LastWriteTime)"
            }
    } else {
        Write-Host "   Nenhum backup encontrado em '$backupDir'"
    }
    exit 1
}

# Verifica se o container do banco está rodando
$containerStatus = docker-compose ps -q db
if (-not $containerStatus) {
    Write-Host "❌ Container do banco não está rodando!" -ForegroundColor Red
    Write-Host "Execute 'docker-compose up -d' primeiro." -ForegroundColor Yellow
    exit 1
}

# Confirmação de segurança
Write-Host "⚠️  ATENÇÃO: Esta operação irá SUBSTITUIR todos os dados atuais!" -ForegroundColor Yellow
Write-Host "Arquivo de backup: $fullBackupPath"
$confirmation = Read-Host "Deseja continuar? (S/N)"

if ($confirmation -ne "S" -and $confirmation -ne "s") {
    Write-Host "Operação cancelada pelo usuário."
    exit 0
}

try {
    Write-Host "`nDropando banco existente..."
    docker-compose exec -T db psql -U admin -d postgres -c "DROP DATABASE IF EXISTS escola;"
    
    Write-Host "Criando novo banco..."
    docker-compose exec -T db psql -U admin -d postgres -c "CREATE DATABASE escola OWNER admin;"
    
    Write-Host "Restaurando dados do backup..."
    Get-Content $fullBackupPath | docker-compose exec -T db psql -U admin -d escola
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Restauração realizada com sucesso!" -ForegroundColor Green
        Write-Host "Backup restaurado: $BackupFile"
        Write-Host "Restauração concluída em: $(Get-Date)"
        
        # Verifica algumas tabelas básicas
        Write-Host "`n📊 Verificando dados restaurados..."
        docker-compose exec -T db psql -U admin -d escola -c "SELECT COUNT(*) as total_alunos FROM alunos;" 2>$null
        docker-compose exec -T db psql -U admin -d escola -c "SELECT COUNT(*) as total_professores FROM professores;" 2>$null
        docker-compose exec -T db psql -U admin -d escola -c "SELECT COUNT(*) as total_turmas FROM turmas;" 2>$null
        
    } else {
        Write-Host "❌ Erro durante a restauração!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erro inesperado: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n💡 O banco foi restaurado com sucesso!"
Write-Host "   Você pode agora acessar o sistema normalmente." -ForegroundColor Green
