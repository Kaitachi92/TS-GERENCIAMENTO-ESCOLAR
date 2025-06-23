// Controller para responsáveis
const pool = require('../config/pg');

const listarResponsaveis = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM responsaveis ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar responsáveis:', err);
    res.status(500).json({ erro: 'Erro ao buscar responsáveis' });
  }
};

module.exports = {
  listarResponsaveis
};
