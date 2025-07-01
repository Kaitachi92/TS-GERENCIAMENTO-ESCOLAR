# Configuração de Backup Automático - Sistema Gerenciamento Escolar

## 📅 Agendamento via Agendador de Tarefas do Windows

### Passos para configurar backup automático diário:

1. **Abrir o Agendador de Tarefas**
   - Pressione `Win + R` e digite `taskschd.msc`
   - Ou busque por "Agendador de Tarefas" no menu iniciar

2. **Criar Nova Tarefa**
   - Clique em "Criar Tarefa..." no painel direito
   - Nome: `Backup Escola Automático`
   - Descrição: `Backup diário do banco de dados do sistema escolar`
   - Marque "Executar com privilégios mais altos"

3. **Configurar Disparadores**
   - Aba "Disparadores" → "Novo..."
   - Iniciar tarefa: `Agendamento`
   - Configurações: `Diariamente`
   - Horário: `02:00` (ou horário de menor uso)
   - Repetir tarefa a cada: `Não configurar`
   - Habilitado: `✓`

4. **Configurar Ações**
   - Aba "Ações" → "Nova..."
   - Ação: `Iniciar um programa`
   - Programa/script: `powershell.exe`
   - Argumentos: `-ExecutionPolicy Bypass -File "C:\caminho\para\projeto\backup-automatico.ps1"`
   - Iniciar em: `C:\caminho\para\projeto\TS-GERENCIAMENTO-ESCOLAR`

5. **Condições (Opcional)**
   - Aba "Condições"
   - Desmarque "Iniciar tarefa apenas se o computador estiver na alimentação AC"
   - Marque "Despertar o computador para executar esta tarefa" (se necessário)

6. **Configurações**
   - Aba "Configurações"
   - Marque "Permitir que a tarefa seja executada sob demanda"
   - Marque "Executar tarefa assim que possível após uma inicialização agendada perdida"
   - "Se a tarefa falhar, reiniciar a cada": `1 minuto`
   - "Tentar reiniciar até": `3 vezes`

## 🔧 Exemplo de Comando Completo

```cmd
powershell.exe -ExecutionPolicy Bypass -File "C:\Users\kaita\OneDrive\Desktop\Nova pasta (4)\TS-GERENCIAMENTO-ESCOLAR\backup-automatico.ps1"
```

## 📋 Configurações Recomendadas

### Para Ambiente de Desenvolvimento:
- **Frequência**: Semanal ou quinzenal
- **Horário**: Fora do horário de trabalho
- **Retenção**: 5-10 backups

### Para Ambiente de Produção:
- **Frequência**: Diária
- **Horário**: Madrugada (2:00-4:00)
- **Retenção**: 30-60 backups
- **Backup adicional**: Semanal para arquivo externo

## 🗂️ Estrutura de Arquivos de Backup

```
TS-GERENCIAMENTO-ESCOLAR/
├── backups/
│   ├── backup_escola_20241215_020000.sql          # Backup manual
│   ├── backup_escola_automatico_20241215_020000.sql  # Backup automático
│   ├── backup_escola_automatico_20241214_020000.sql
│   └── ... (mantém apenas os 10 mais recentes)
├── backup-database.ps1
├── backup-automatico.ps1
├── restore-backup.ps1
└── test-backup.ps1
```

## 🚨 Monitoramento e Alertas

### Verificar Status dos Backups:
```powershell
# Listar backups recentes
Get-ChildItem "backups\backup_escola_automatico_*.sql" | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -First 5 Name, LastWriteTime, @{Name="Size(KB)";Expression={[math]::Round($_.Length/1KB,2)}}
```

### Verificar se o Agendamento está Ativo:
1. Abra o Agendador de Tarefas
2. Procure por "Backup Escola Automático"
3. Verifique a coluna "Status" e "Próxima Execução"

### Log de Execução:
- O Agendador de Tarefas mantém um histórico na aba "Histórico"
- Verifique regularmente se os backups estão sendo executados

## ⚡ Teste Rápido

Para testar se tudo está funcionando:

```powershell
# Teste o script manualmente primeiro
.\test-backup.ps1

# Execute o backup automático manualmente
.\backup-automatico.ps1

# Verifique se o arquivo foi criado
dir backups\
```

## 📧 Alertas por Email (Avançado)

Para receber notificações por email em caso de falha, você pode:

1. Usar o Task Scheduler com scripts PowerShell que enviam email
2. Configurar logs para o Event Viewer
3. Usar ferramentas de monitoramento third-party

## 🔄 Backup para Locais Externos

Considere também fazer backup para:
- **OneDrive/Google Drive**: Copie os arquivos .sql periodicamente
- **Pendrive/HD Externo**: Para backup físico
- **Servidor remoto**: Para empresas com infraestrutura própria
