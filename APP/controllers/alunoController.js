const pool = require('../config/pg');

function validarNome(nome) {
  return nome && typeof nome === 'string';
}

function validarTurmaId(turma_id) {
  return typeof turma_id === 'number' && !isNaN(turma_id);
}

// CRUD de Alunos usando PostgreSQL
exports.listarAlunos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alunos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar alunos.' });
  }
};

exports.criarAluno = async (req, res) => {
  const { nome, turma_id } = req.body;
  if (!validarNome(nome)) {
    return res.status(400).json({ erro: 'Nome é obrigatório.' });
  }
  if (!validarTurmaId(Number(turma_id))) {
    return res.status(400).json({ erro: 'Turma é obrigatória.' });
  }
  try {
    const result = await pool.query('INSERT INTO alunos (nome, turma_id) VALUES ($1, $2) RETURNING *', [nome, turma_id]);
    const aluno = result.rows[0];
    
    // Broadcast via WebSocket
    if (global.broadcastChange) {
      global.broadcastChange('CREATE', 'aluno', aluno);
    }
    
    return res.status(201).json(aluno);
  } catch (err) {
    console.error('Erro ao criar aluno:', err); // Adiciona log detalhado
    return res.status(500).json({ erro: 'Erro ao criar aluno.' });
  }
};

exports.buscarAluno = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM alunos WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar aluno.' });
  }
};

exports.atualizarAluno = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, turma_id } = req.body;
  if (!validarNome(nome)) {
    return res.status(400).json({ erro: 'Nome é obrigatório.' });
  }
  if (!validarTurmaId(Number(turma_id))) {
    return res.status(400).json({ erro: 'Turma é obrigatória.' });
  }
  try {
    const result = await pool.query('UPDATE alunos SET nome = $1, turma_id = $2 WHERE id = $3 RETURNING *', [nome, turma_id, id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });
    
    const aluno = result.rows[0];
    
    // Broadcast via WebSocket
    if (global.broadcastChange) {
      global.broadcastChange('UPDATE', 'aluno', aluno);
    }
    
    return res.json(aluno);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar aluno.' });
  }
};

exports.deletarAluno = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM alunos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });
    
    // Broadcast via WebSocket
    if (global.broadcastChange) {
      global.broadcastChange('DELETE', 'aluno', { id });
    }
    
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar aluno.' });
  }
};
