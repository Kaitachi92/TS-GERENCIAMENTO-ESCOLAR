# 🚀 Guia Rápido de Execução

## Passo a Passo para Rodar o Projeto

### 1. Instalar Dependências do Backend

```powershell
cd APP
npm install
```

### 2. Instalar Dependências do Frontend

```powershell
cd frontend
npm install
```

### 3. Iniciar o Backend com Docker

```powershell
# Na raiz do projeto
docker-compose up -d
```

Isso irá:
- Criar o banco de dados PostgreSQL
- Iniciar o backend na porta 3000
- Configurar o WebSocket (Socket.IO)

### 4. Rodar Migrações (se necessário)

```powershell
cd APP
npm run migrate
```

### 5. Iniciar o Frontend

```powershell
cd frontend
npm run dev
```

O frontend estará disponível em: http://localhost:5173

## 🔍 Verificar se está funcionando

1. **Backend API**: Acesse http://localhost:3000 - deve retornar JSON com status
2. **Frontend React**: Acesse http://localhost:5173 - deve exibir a interface
3. **Views EJS**: Acesse http://localhost:3000/dashboard - deve exibir o dashboard
4. **WebSocket**: O indicador de conexão deve aparecer como "🟢 WebSocket Conectado"

## 🛑 Parar os serviços

```powershell
# Parar Docker
docker-compose down

# Parar Frontend (Ctrl+C no terminal)
```

## 📊 Testar o CRUD

1. Acesse http://localhost:5173
2. Navegue entre as abas "Alunos" e "Turmas"
3. Teste:
   - ➕ Criar novo registro
   - ✏️ Editar registro existente
   - 🗑️ Deletar registro
   - 🔍 Buscar por nome

## 🔧 Troubleshooting

### Backend não inicia
```powershell
# Verificar logs do Docker
docker-compose logs backend

# Recriar containers
docker-compose down
docker-compose up --build -d
```

### Frontend não conecta ao backend
- Verifique se o backend está rodando na porta 3000
- Verifique o proxy no arquivo `frontend/vite.config.ts`

### WebSocket não conecta
- Verifique se o backend está rodando
- Verifique o console do navegador para erros
- Confirme que a porta 3000 está acessível
