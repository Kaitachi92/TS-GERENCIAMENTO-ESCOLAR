// Controller para disciplinas
const pool = require('../config/pg');

const listarDisciplinas = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM disciplinas ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar disciplinas:', err);
    res.status(500).json({ erro: 'Erro ao buscar disciplinas' });
  }
};

module.exports = {
  listarDisciplinas
};
