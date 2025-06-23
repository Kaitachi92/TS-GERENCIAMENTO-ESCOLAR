// Controller para mensalidades
const pool = require('../config/pg');

const listarMensalidades = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM mensalidades ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar mensalidades:', err);
    res.status(500).json({ erro: 'Erro ao buscar mensalidades' });
  }
};

module.exports = {
  listarMensalidades
};
