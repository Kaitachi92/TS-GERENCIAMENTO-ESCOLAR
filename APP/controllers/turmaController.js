const pool = require('../config/pg');

function validarNome(nome) {
  return nome && typeof nome === 'string';
}

// CRUD de Turmas usando PostgreSQL
exports.listarTurmas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM turmas ORDER BY id');
    console.log('Resultado SELECT turmas:', result.rows); // <-- log para debug
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar turmas.' });
  }
};

exports.criarTurma = async (req, res) => {
  const { nome, ano_letivo, turno, nivel_ensino } = req.body;
  if (!validarNome(nome)) {
    return res.status(400).json({ erro: 'Nome é obrigatório.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO turmas (nome, ano_letivo, turno, nivel_ensino) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, ano_letivo || null, turno || null, nivel_ensino || null]
    );
    const turma = result.rows[0];
    
    // Broadcast via WebSocket
    if (global.broadcastChange) {
      global.broadcastChange('CREATE', 'turma', turma);
    }
    
    return res.status(201).json(turma);
  } catch (err) {
    console.error('Erro ao criar turma:', err.message, err.stack);
    return res.status(500).json({ erro: 'Erro ao criar turma.', detalhes: err.message });
  }
};

exports.buscarTurma = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM turmas WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Turma não encontrada.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar turma.' });
  }
};

exports.atualizarTurma = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, ano_letivo, turno, nivel_ensino } = req.body;
  if (!validarNome(nome)) {
    return res.status(400).json({ erro: 'Nome é obrigatório.' });
  }
  try {
    const result = await pool.query(
      'UPDATE turmas SET nome = $1, ano_letivo = $2, turno = $3, nivel_ensino = $4 WHERE id = $5 RETURNING *',
      [nome, ano_letivo || null, turno || null, nivel_ensino || null, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Turma não encontrada.' });
    
    const turma = result.rows[0];
    
    // Broadcast via WebSocket
    if (global.broadcastChange) {
      global.broadcastChange('UPDATE', 'turma', turma);
    }
    
    return res.json(turma);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar turma.' });
  }
};

exports.deletarTurma = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM turmas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Turma não encontrada.' });
    
    // Broadcast via WebSocket
    if (global.broadcastChange) {
      global.broadcastChange('DELETE', 'turma', { id });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar turma:', err.message);
    res.status(500).json({ erro: 'Erro ao deletar turma.', detalhes: err.message });
  }
};
