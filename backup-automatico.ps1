# Script para backup automático agendado do banco PostgreSQL
# Este script pode ser executado periodicamente via Agendador de Tarefas do Windows

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "backup_escola_automatico_$timestamp.sql"
$backupDir = "backups"
$maxBackups = 10  # Manter apenas os 10 backups mais recentes

# Cria diretório de backup se não existir
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

Write-Host "=== BACKUP AUTOMÁTICO - $(Get-Date) ==="

# Verifica se o container do banco está rodando
$containerStatus = docker-compose ps -q db 2>$null
if (-not $containerStatus) {
    Write-Host "Container do banco não está rodando. Backup cancelado."
    exit 0
}

try {
    # Executa backup
    docker-compose exec -T db pg_dump -U admin -d escola > "$backupDir\$backupFile"
    
    if ($LASTEXITCODE -eq 0) {
        $fileSize = (Get-Item "$backupDir\$backupFile").Length / 1KB
        Write-Host "Backup automático realizado: $backupFile ($([math]::Round($fileSize, 2)) KB)"
        
        # Remove backups antigos (mantém apenas os mais recentes)
        $oldBackups = Get-ChildItem "$backupDir\backup_escola_automatico_*.sql" | 
                      Sort-Object LastWriteTime -Descending | 
                      Select-Object -Skip $maxBackups
        
        if ($oldBackups) {
            Write-Host "Removendo $($oldBackups.Count) backup(s) antigo(s)..."
            $oldBackups | Remove-Item -Force
        }
        
        Write-Host "Total de backups automáticos: $((Get-ChildItem "$backupDir\backup_escola_automatico_*.sql").Count)"
        
    } else {
        Write-Host "Erro no backup automático!"
        exit 1
    }
} catch {
    Write-Host "Erro inesperado no backup automático: $($_.Exception.Message)"
    exit 1
}
