# Sistema de Gerenciamento Escolar - Frontend

## 📚 Objetivo

Este projeto implementa o **front-end completo** do Sistema de Gerenciamento Escolar desenvolvido no semestre anterior. A interface foi construída utilizando **React + TypeScript**, consumindo a API REST do backend através de requisições HTTP e recebendo notificações em tempo real via **WebSocket (Socket.IO)**.

Esta é a etapa final do projeto, focada em atender aos seguintes requisitos:

- ✅ Views funcionando + Backend API no Docker
- ✅ Pré-compilador Vite
- ✅ TypeScript no frontend (.tsx e .ts)
- ✅ React tipado (React + TypeScript)
- ✅ Views EJS no backend
- ✅ WebSocket + Custom Hook

---

## 🎯 Entidades Escolhidas para CRUD

As duas entidades implementadas com **CRUD completo** (Create, Read, Update, Delete) são:

### 1. **👨‍🎓 Alunos**
- Campos: `id`, `nome`, `data_nascimento`, `turma_id`, `endereco`, `telefone_contato`
- View: `frontend/src/views/AlunoView.tsx`
- Funcionalidades: Cadastro, listagem, edição, exclusão e busca por nome

### 2. **🏫 Turmas**
- Campos: `id`, `nome`, `ano_escolar`, `turno`, `sala`, `capacidade_maxima`
- View: `frontend/src/views/TurmaView.tsx`
- Funcionalidades: Cadastro, listagem, edição, exclusão e busca por nome

---

## 🚀 Instruções de Execução

### Pré-requisitos

- **Node.js** (v18 ou superior)
- **Docker** e **Docker Compose**
- **Git**

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/Kaitachi92/TS-GERENCIAMENTO-ESCOLAR.git
cd TS-GERENCIAMENTO-ESCOLAR
```

### Passo 2: Iniciar o Backend com Docker

```bash
# Subir containers Docker (banco de dados + backend)
docker-compose up -d

# Verificar se os containers estão rodando
docker-compose ps

# O backend estará disponível em: http://localhost:3000
# O WebSocket estará disponível em: ws://localhost:3000
```

### Passo 3: Instalar dependências do Frontend

```bash
cd frontend
npm install
```

### Passo 4: Executar o Frontend em modo desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

### Passo 5: Acessar a aplicação

- **Frontend React**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Views EJS Dashboard**: http://localhost:3000/dashboard

---

## 🏗️ Build do Projeto (Vite)

### Gerar build de produção

```bash
cd frontend
npm run build
```

Os arquivos otimizados serão gerados na pasta `frontend/dist/`.

### Pré-visualizar o build de produção

```bash
npm run preview
```

Isso iniciará um servidor local para testar o build de produção.

### Configuração do Vite

O projeto utiliza **Vite** como pré-compilador, configurado em `frontend/vite.config.ts`:

- **Porta de desenvolvimento**: 5173
- **Proxy para API**: Todas as rotas (`/alunos`, `/turmas`, etc.) são redirecionadas para `http://localhost:3000`
- **Proxy WebSocket**: Configurado em `/socket.io` com suporte a `ws: true`

---

## 🔌 WebSocket e Custom Hook

### Implementação do WebSocket

O backend utiliza **Socket.IO** para comunicação em tempo real:

**Arquivo**: `APP/app.js`

```javascript
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });

  socket.on('ping', () => {
    socket.emit('pong', { message: 'WebSocket funcionando!' });
  });
});

// Broadcast de mudanças nas entidades
global.broadcastChange = (type, entity, data) => {
  io.emit('entityChange', { type, entity, data, timestamp: new Date().toISOString() });
};
```

### Custom Hook: `useWebSocket`

**Arquivo**: `frontend/src/hooks/useWebSocket.ts`

O hook customizado gerencia toda a lógica de conexão WebSocket:

```typescript
export const useWebSocket = (url: string = 'http://localhost:3000'): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('entityChange', (data) => setLastMessage(data));

    return () => socket.disconnect();
  }, [url]);

  return { isConnected, lastMessage, sendMessage, error };
};
```

### Uso nas Views

```typescript
const { isConnected, lastMessage } = useWebSocket('http://localhost:3000');

useEffect(() => {
  if (lastMessage && lastMessage.entity === 'aluno') {
    loadAlunos(); // Atualizar lista quando houver mudanças
  }
}, [lastMessage]);
```

---

## 📡 Exemplos de Rotas da API

### Alunos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/alunos` | Listar todos os alunos |
| `GET` | `/alunos/:id` | Buscar aluno por ID |
| `POST` | `/alunos` | Criar novo aluno |
| `PUT` | `/alunos/:id` | Atualizar aluno |
| `DELETE` | `/alunos/:id` | Deletar aluno |

**Exemplo de requisição POST:**

```bash
curl -X POST http://localhost:3000/alunos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "data_nascimento": "2015-05-20",
    "turma_id": 1,
    "telefone_contato": "(11) 99999-9999"
  }'
```

### Turmas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/turmas` | Listar todas as turmas |
| `GET` | `/turmas/:id` | Buscar turma por ID |
| `POST` | `/turmas` | Criar nova turma |
| `PUT` | `/turmas/:id` | Atualizar turma |
| `DELETE` | `/turmas/:id` | Deletar turma |

**Exemplo de requisição POST:**

```bash
curl -X POST http://localhost:3000/turmas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "1º Ano A",
    "ano_escolar": "1º Ano",
    "turno": "Matutino",
    "sala": "Sala 101",
    "capacidade_maxima": 30
  }'
```

---

## 📂 Estrutura do Projeto

```
TS-GERENCIAMENTO-ESCOLAR/
├── APP/                          # Backend (Node.js + Express)
│   ├── app.js                    # Servidor principal com WebSocket
│   ├── views/                    # Views EJS
│   │   └── dashboard.ejs         # Dashboard com listagem de alunos e turmas
│   ├── routes/                   # Rotas da API
│   ├── controllers/              # Controllers
│   └── config/                   # Configurações (DB)
│
├── frontend/                     # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── views/                # Views principais de CRUD
│   │   │   ├── AlunoView.tsx     # CRUD completo de Alunos
│   │   │   ├── AlunoView.scss
│   │   │   ├── TurmaView.tsx     # CRUD completo de Turmas
│   │   │   └── TurmaView.scss
│   │   ├── hooks/                # Custom Hooks
│   │   │   └── useWebSocket.ts   # Hook de gerenciamento WebSocket
│   │   ├── services/             # Camada de serviços
│   │   │   └── api.ts            # Funções para consumo da API REST
│   │   ├── types/                # Tipos TypeScript
│   │   │   └── index.ts          # Interfaces centralizadas
│   │   ├── pages/
│   │   │   └── App.tsx           # Componente principal
│   │   └── styles/
│   │       └── global.scss       # Estilos globais
│   ├── vite.config.ts            # Configuração do Vite
│   ├── tsconfig.json             # Configuração TypeScript
│   └── package.json
│
├── docker-compose.yml            # Orquestração Docker
└── README.md                     # Este arquivo
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript 5** - Tipagem estática
- **Vite 5** - Pré-compilador ultra-rápido
- **Socket.IO Client** - WebSocket para tempo real
- **SCSS** - Pré-processador CSS

### Backend
- **Node.js + Express** - Servidor HTTP
- **Socket.IO** - WebSocket server-side
- **EJS** - Template engine para views server-side
- **PostgreSQL** - Banco de dados
- **Docker** - Containerização

---

## ✅ Checklist de Critérios Atendidos

- ✅ **Views funcionando + Backend API no Docker** (3 pontos)
- ✅ **Pré-compilador Vite funcionando** (2 pontos)
- ✅ **Uso de TypeScript no front-end** (1 ponto)
- ✅ **Uso de React tipado (React + TypeScript)** (1 ponto)
- ✅ **Uso de views EJS** (1 ponto)
- ✅ **Uso de WebSocket + custom hook** (2 pontos)

**Total: 10 pontos** ✅

---

## 👥 Autor

Kaitachi92 - [GitHub](https://github.com/Kaitachi92)

---

## 📄 Licença

Este projeto é de uso acadêmico.
