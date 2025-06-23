const pool = require('../config/pg');

function validarNome(nome) {
  return nome && typeof nome === 'string' && nome.trim().length > 0 && isNaN(Number(nome));
}

// Listar todos os professores (com turmas vinculadas)
exports.listarProfessores = async (req, res) => {
  try {
    // Busca todos os professores (tabela plural)
    const profResult = await pool.query('SELECT * FROM professores ORDER BY id');
    const professores = profResult.rows;
    // Busca todos os vínculos professor-turma
    const vincResult = await pool.query('SELECT professor_id, turma_id FROM professor_turma');
    // Monta um map de professor_id para array de turma_id
    const map = {};
    vincResult.rows.forEach(v => {
      if (!map[v.professor_id]) map[v.professor_id] = [];
      map[v.professor_id].push(v.turma_id);
    });
    // Adiciona campo turmas: number[]
    const resposta = professores.map(p => ({ ...p, turmas: map[p.id] || [] }));
    res.json(resposta);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar professores.' });
  }
};

// Criar professor (e vincular turma se enviado)
exports.criarProfessor = async (req, res) => {
  const { nome, turma_id } = req.body;
  console.log('REQ.BODY criarProfessor:', req.body); // LOG
  if (!validarNome(nome)) {
    return res.status(400).json({ erro: 'Nome é obrigatório e não pode ser só número.' });
  }
  try {
    const turmaIdNum = Number(turma_id);
    // Verifica se turma existe antes de criar o professor
    let turmaExiste = false;
    if (!isNaN(turmaIdNum) && turmaIdNum > 0) {
      const turmaCheck = await pool.query('SELECT id FROM turmas WHERE id = $1', [turmaIdNum]);
      turmaExiste = turmaCheck.rows.length > 0;
    }
    if (!turmaExiste) {
      return res.status(400).json({ erro: 'Turma não encontrada.' });
    }
    const result = await pool.query('INSERT INTO professores (nome) VALUES ($1) RETURNING *', [nome]);
    const professor = result.rows[0];
    let vincResult;
    try {
      vincResult = await pool.query('INSERT INTO professor_turma (professor_id, turma_id) VALUES ($1, $2) RETURNING *', [professor.id, turmaIdNum]);
      if (!vincResult.rows.length) {
        throw new Error('Falha ao criar vínculo professor-turma. Nenhuma linha inserida.');
      }
    } catch (errInsert) {
      console.error('ERRO ao inserir em professor_turma:', errInsert);
      return res.status(500).json({ erro: 'Erro ao criar vínculo professor-turma.', detalhe: errInsert.message });
    }
    // LOG para debug
    const vincs = await pool.query('SELECT * FROM professor_turma WHERE professor_id = $1', [professor.id]);
    console.log('Vínculos criados para o professor:', vincs.rows);
    return res.status(201).json({ ...professor, turmas: [turmaIdNum] });
  } catch (err) {
    console.error('Erro ao criar professor:', err);
    return res.status(500).json({ erro: 'Erro ao criar professor.' });
  }
};

// Buscar professor
exports.buscarProfessor = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM professores WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Professor não encontrado.' });
    // Busca turmas vinculadas
    const vinc = await pool.query('SELECT turma_id FROM professor_turma WHERE professor_id = $1', [id]);
    const turmas = vinc.rows.map(v => v.turma_id);
    res.json({ ...result.rows[0], turmas });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar professor.' });
  }
};

// Atualizar professor
exports.atualizarProfessor = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome } = req.body;
  if (!validarNome(nome)) {
    return res.status(400).json({ erro: 'Nome é obrigatório.' });
  }
  try {
    const result = await pool.query('UPDATE professores SET nome = $1 WHERE id = $2 RETURNING *', [nome, id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Professor não encontrado.' });
    // Busca turmas vinculadas
    const vinc = await pool.query('SELECT turma_id FROM professor_turma WHERE professor_id = $1', [id]);
    const turmas = vinc.rows.map(v => v.turma_id);
    return res.json({ ...result.rows[0], turmas });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar professor.' });
  }
};

// Deletar professor
exports.deletarProfessor = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    // Remove vínculos antes de deletar
    await pool.query('DELETE FROM professor_turma WHERE professor_id = $1', [id]);
    const result = await pool.query('DELETE FROM professores WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ erro: 'Professor não encontrado.' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar professor.' });
  }
};
