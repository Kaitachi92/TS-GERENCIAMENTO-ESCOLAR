# Script para testar o sistema de backup/restore
Write-Host "=== TESTE DO SISTEMA DE BACKUP/RESTORE ==="
Write-Host "Este script irá testar o backup e restore do banco de dados.`n"

# Verifica se o sistema está rodando
Write-Host "1. Verificando se o sistema está rodando..."
$containerStatus = docker-compose ps -q db
if (-not $containerStatus) {
    Write-Host "❌ Sistema não está rodando. Execute ./start-tudo.ps1 primeiro." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Sistema está rodando." -ForegroundColor Green

# Mostra dados atuais
Write-Host "`n2. Consultando dados atuais..."
$currentData = docker-compose exec -T db psql -U admin -d escola -c "SELECT COUNT(*) FROM alunos;" 2>$null
Write-Host "Dados atuais consultados." -ForegroundColor Green

# Faz backup
Write-Host "`n3. Fazendo backup de teste..."
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$testBackupFile = "backup_teste_$timestamp.sql"
$backupDir = "backups"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

try {
    docker-compose exec -T db pg_dump -U admin -d escola > "$backupDir\$testBackupFile"
    if ($LASTEXITCODE -eq 0) {
        $fileSize = (Get-Item "$backupDir\$testBackupFile").Length
        Write-Host "✅ Backup de teste criado: $testBackupFile ($fileSize bytes)" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao criar backup de teste!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erro inesperado ao fazer backup: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Pergunta se quer testar o restore (destrutivo)
Write-Host "`n4. Teste de restauração (DESTRUTIVO)"
Write-Host "⚠️  O teste de restore irá SUBSTITUIR os dados atuais!" -ForegroundColor Yellow
$testRestore = Read-Host "Deseja testar o restore? (S/N)"

if ($testRestore -eq "S" -or $testRestore -eq "s") {
    Write-Host "`nTestando restore..."
    
    try {
        # Drop e recria o banco
        docker-compose exec -T db psql -U admin -d postgres -c "DROP DATABASE IF EXISTS escola;" > $null 2>&1
        docker-compose exec -T db psql -U admin -d postgres -c "CREATE DATABASE escola OWNER admin;" > $null 2>&1
        
        # Restaura o backup
        Get-Content "$backupDir\$testBackupFile" | docker-compose exec -T db psql -U admin -d escola > $null 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Restore de teste executado com sucesso!" -ForegroundColor Green
            
            # Verifica se os dados foram restaurados
            Write-Host "`nVerificando dados restaurados..."
            docker-compose exec -T db psql -U admin -d escola -c "SELECT COUNT(*) as total_alunos FROM alunos;" 2>$null
            
        } else {
            Write-Host "❌ Erro no restore de teste!" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Erro inesperado no restore: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Teste de restore cancelado pelo usuário."
}

# Limpeza
Write-Host "`n5. Limpeza..."
if (Test-Path "$backupDir\$testBackupFile") {
    $keepFile = Read-Host "Manter arquivo de backup de teste '$testBackupFile'? (S/N)"
    if ($keepFile -ne "S" -and $keepFile -ne "s") {
        Remove-Item "$backupDir\$testBackupFile" -Force
        Write-Host "Arquivo de teste removido."
    }
}

Write-Host "`n=== TESTE CONCLUÍDO ==="
Write-Host "💡 Scripts disponíveis:"
Write-Host "   .\backup-database.ps1                    # Backup manual"
Write-Host "   .\restore-backup.ps1 [arquivo]           # Restore específico"
Write-Host "   .\backup-automatico.ps1                  # Backup automático"
