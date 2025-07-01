# Backup do banco PostgreSQL com timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "backup_escola_$timestamp.sql"
$backupDir = "backups"

# Cria diretório de backup se não existir
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
    Write-Host "Diretório 'backups' criado."
}

Write-Host "=== BACKUP DO BANCO DE DADOS ESCOLA ==="
Write-Host "Iniciando backup em: $(Get-Date)"
Write-Host "Arquivo de backup: $backupDir\$backupFile"

# Verifica se o container do banco está rodando
$containerStatus = docker-compose ps -q db
if (-not $containerStatus) {
    Write-Host "ERRO: Container do banco não está rodando!" -ForegroundColor Red
    Write-Host "Execute 'docker-compose up -d' primeiro." -ForegroundColor Yellow
    exit 1
}

try {
    # Executa pg_dump no container do banco
    Write-Host "Executando backup..."
    docker-compose exec -T db pg_dump -U admin -d escola > "$backupDir\$backupFile"
    
    if ($LASTEXITCODE -eq 0) {
        $fileSize = (Get-Item "$backupDir\$backupFile").Length / 1KB
        Write-Host "Backup realizado com sucesso!" -ForegroundColor Green
        Write-Host "Arquivo: $backupDir\$backupFile ($([math]::Round($fileSize, 2)) KB)"
        Write-Host "Backup concluído em: $(Get-Date)"
        
        # Lista os últimos 5 backups
        Write-Host "`nÚltimos backups disponíveis:"
        Get-ChildItem "$backupDir\backup_escola_*.sql" | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -First 5 | 
            ForEach-Object { 
                $size = [math]::Round($_.Length / 1KB, 2)
                Write-Host "   $($_.Name) - $size KB - $($_.LastWriteTime)"
            }
    } else {
        Write-Host "Erro durante o backup!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Erro inesperado: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nPara restaurar este backup, use:"
Write-Host "   .\restore-backup.ps1 $backupFile" -ForegroundColor Cyan
