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
  const { nome } = req.body;
  if (!validarNome(nome)) {
    return res.status(400).json({ erro: 'Nome é obrigatório.' });
  }
  try {
    const result = await pool.query('INSERT INTO turmas (nome) VALUES ($1) RETURNING *', [nome]);
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao criar turma.' });
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
  const { nome } = req.body;
  if (!validarNome(nome)) {
    return res.status(400).json({ erro: 'Nome é obrigatório.' });
  }
  try {
    const result = await pool.query('UPDATE turmas SET nome = $1 WHERE id = $2 RETURNING *', [nome, id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Turma não encontrada.' });
    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar turma.' });
  }
};

exports.deletarTurma = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM turmas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Turma não encontrada.' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar turma.' });
  }
};
