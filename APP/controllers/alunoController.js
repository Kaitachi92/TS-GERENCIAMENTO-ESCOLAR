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
  const { nome, turma_id, data_nascimento, endereco, telefone } = req.body;
  if (!validarNome(nome)) {
    return res.status(400).json({ erro: 'Nome é obrigatório.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO alunos (nome, turma_id, data_nascimento, endereco, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, turma_id || null, data_nascimento || null, endereco || null, telefone || null]
    );
    const aluno = result.rows[0];
    
    // Broadcast via WebSocket
    if (global.broadcastChange) {
      global.broadcastChange('CREATE', 'aluno', aluno);
    }
    
    return res.status(201).json(aluno);
  } catch (err) {
    console.error('Erro ao criar aluno:', err.message, err.stack);
    return res.status(500).json({ erro: 'Erro ao criar aluno.', detalhes: err.message });
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
  const { nome, turma_id, data_nascimento, endereco, telefone } = req.body;
  if (!validarNome(nome)) {
    return res.status(400).json({ erro: 'Nome é obrigatório.' });
  }
  try {
    const result = await pool.query(
      'UPDATE alunos SET nome = $1, turma_id = $2, data_nascimento = $3, endereco = $4, telefone = $5 WHERE id = $6 RETURNING *',
      [nome, turma_id || null, data_nascimento || null, endereco || null, telefone || null, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });
    
    const aluno = result.rows[0];
    
    // Broadcast via WebSocket
    if (global.broadcastChange) {
      global.broadcastChange('UPDATE', 'aluno', aluno);
    }
    
    return res.json(aluno);
  } catch (err) {
    console.error('Erro ao atualizar aluno:', err.message);
    return res.status(500).json({ erro: 'Erro ao atualizar aluno.', detalhes: err.message });
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
