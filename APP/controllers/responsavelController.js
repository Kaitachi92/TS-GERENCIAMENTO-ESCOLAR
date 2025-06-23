// Controller para responsáveis
const pool = require('../config/pg');

const listarResponsaveis = async (req, res) => {
  try {
    // Busca apenas responsáveis que possuem alunos cadastrados, trazendo também o nome dos alunos
    const { rows } = await pool.query(`
      SELECT r.*, array_agg(a.nome) AS alunos
      FROM responsaveis r
      JOIN alunos a ON a.responsavel_id = r.id
      GROUP BY r.id
      ORDER BY r.id
    `);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar responsáveis:', err);
    res.status(500).json({ erro: 'Erro ao buscar responsáveis' });
  }
};

module.exports = {
  listarResponsaveis
};
