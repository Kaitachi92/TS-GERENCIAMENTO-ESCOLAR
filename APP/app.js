const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Tornar io disponível em todas as rotas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rotas
const alunoRoutes = require('./routes/alunoRoutes');
const turmaRoutes = require('./routes/turmaRoutes');
const professorRoutes = require('./routes/professorRoutes');
const responsavelRoutes = require('./routes/responsavelRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const mensalidadeRoutes = require('./routes/mensalidadeRoutes');

app.use('/alunos', alunoRoutes);
app.use('/turmas', turmaRoutes);
app.use('/professores', professorRoutes);
app.use('/responsaveis', responsavelRoutes);
app.use('/disciplinas', disciplinaRoutes);
app.use('/mensalidades', mensalidadeRoutes);

// Rota para views EJS
app.get('/dashboard', async (req, res) => {
  try {
    const db = require('./config/pg');
    const alunosResult = await db.query('SELECT * FROM alunos ORDER BY id');
    const turmasResult = await db.query('SELECT * FROM turmas ORDER BY id');
    res.render('dashboard', { 
      alunos: alunosResult.rows, 
      turmas: turmasResult.rows,
      title: 'Dashboard - Sistema Escolar'
    });
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
    res.status(500).send('Erro ao carregar dashboard');
  }
});

// WebSocket - Gerenciamento de conexões
io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });

  // Listener para testes
  socket.on('ping', () => {
    socket.emit('pong', { message: 'WebSocket funcionando!', timestamp: new Date().toISOString() });
  });
});

// Função para broadcast de mudanças (será usada pelos controllers)
global.broadcastChange = (type, entity, data) => {
  io.emit('entityChange', {
    type,
    entity,
    data,
    timestamp: new Date().toISOString()
  });
};

// Tratamento global de erros para evitar crash do backend
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

app.get('/', (req, res) => res.json({ 
  status: 'API rodando!',
  websocket: 'Socket.IO habilitado',
  views: 'EJS configurado'
}));

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`WebSocket disponível em ws://localhost:${PORT}`);
});
