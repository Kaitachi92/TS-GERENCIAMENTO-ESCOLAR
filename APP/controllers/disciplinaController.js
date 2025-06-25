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

const deletarDisciplina = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM disciplinas WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Disciplina não encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar disciplina:', err);
    res.status(500).json({ erro: 'Erro ao deletar disciplina' });
  }
};

const criarDisciplina = async (req, res) => {
  const { nome, turma, professor, carga_horaria, turno, observacoes, ano_letivo, area_conhecimento, optativa } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO disciplinas (nome, turma, professor, carga_horaria, turno, observacoes, ano_letivo, area_conhecimento, optativa) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [nome, turma, professor, carga_horaria, turno, observacoes, ano_letivo, area_conhecimento, optativa]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar disciplina:', err);
    res.status(500).json({ erro: 'Erro ao criar disciplina' });
  }
};

module.exports = {
  listarDisciplinas,
  deletarDisciplina,
  criarDisciplina
};
