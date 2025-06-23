const express = require('express');
const app = express();
app.use(express.json());

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

// Outras rotas podem ser adicionadas aqui

// Tratamento global de erros para evitar crash do backend
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

app.get('/', (req, res) => res.json({ status: 'API rodando!' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
