// Controller para responsáveis
const pool = require('../config/pg');

const listarResponsaveis = async (req, res) => {
  try {
    // Busca todos os responsáveis, trazendo também o array de IDs dos alunos (ou vazio)
    const { rows } = await pool.query(`
      SELECT r.*, 
        COALESCE(array_agg(a.id ORDER BY a.id) FILTER (WHERE a.id IS NOT NULL), '{}') AS alunos
      FROM responsaveis r
      LEFT JOIN alunos a ON a.responsavel_id = r.id
      GROUP BY r.id
      ORDER BY r.id
    `);
    // Garante que o campo alunos seja sempre array de números
    const result = rows.map(r => ({ ...r, alunos: (r.alunos || []).map(Number) }));
    res.json(result);
  } catch (err) {
    console.error('Erro ao buscar responsáveis:', err);
    res.status(500).json({ erro: 'Erro ao buscar responsáveis' });
  }
};

// Busca responsável por ID
const buscarResponsavelPorId = async (req, res) => {
  try {
    console.log('Recebida requisição GET /responsaveis/:id', req.params);
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT r.*, COALESCE(array_agg(a.id) FILTER (WHERE a.id IS NOT NULL), '{}') AS alunos
      FROM responsaveis r
      LEFT JOIN alunos a ON a.responsavel_id = r.id
      WHERE r.id = $1
      GROUP BY r.id
    `, [id]);
    console.log('Resultado da query:', rows);
    if (rows.length === 0) {
      console.log('Responsável não encontrado para o id:', id);
      return res.status(404).json({ erro: 'Responsável não encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar responsável por ID:', err.message, err.stack);
    res.status(500).json({ erro: 'Erro ao buscar responsável por ID', detalhe: err.message });
  }
};

// Cria um novo responsável
const criarResponsavel = async (req, res) => {
  try {
    const { nome, cpf, telefone, email, parentesco, endereco, observacoes, pagador_principal, acesso_portal, doc_pendente, alunos = [] } = req.body;
    console.log('Criando responsável. Alunos recebidos:', alunos);
    const result = await pool.query(
      `INSERT INTO responsaveis (nome, cpf, telefone, email, parentesco, endereco, observacoes, pagador_principal, acesso_portal, doc_pendente)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [nome, cpf, telefone, email, parentesco, endereco, observacoes, pagador_principal, acesso_portal, doc_pendente]
    );
    const responsavelId = result.rows[0].id;
    // Limpa vínculo anterior de todos os alunos que tinham esse responsável
    await pool.query('UPDATE alunos SET responsavel_id = NULL WHERE responsavel_id = $1', [responsavelId]);
    // Vincula os novos alunos
    const alunosIds = Array.isArray(alunos) ? alunos.map(Number).filter(n => !isNaN(n)) : [];
    if (alunosIds.length > 0) {
      const updateResult = await pool.query('UPDATE alunos SET responsavel_id = $1 WHERE id = ANY($2::int[])', [responsavelId, alunosIds]);
      console.log('Resultado do update de alunos:', updateResult.rowCount, 'IDs:', alunosIds);
    } else {
      console.log('Nenhum aluno para vincular. Array recebido:', alunos);
    }
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar responsável:', err);
    res.status(500).json({ erro: 'Erro ao criar responsável' });
  }
};

// Atualiza um responsável
const atualizarResponsavel = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, telefone, email, parentesco, endereco, observacoes, pagador_principal, acesso_portal, doc_pendente, alunos = [] } = req.body;
    console.log('Atualizando responsável. Alunos recebidos:', alunos);
    const result = await pool.query(
      `UPDATE responsaveis SET nome=$1, cpf=$2, telefone=$3, email=$4, parentesco=$5, endereco=$6, observacoes=$7, pagador_principal=$8, acesso_portal=$9, doc_pendente=$10 WHERE id=$11 RETURNING *`,
      [nome, cpf, telefone, email, parentesco, endereco, observacoes, pagador_principal, acesso_portal, doc_pendente, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Responsável não encontrado' });
    }
    // Limpa vínculo anterior de todos os alunos que tinham esse responsável
    await pool.query('UPDATE alunos SET responsavel_id = NULL WHERE responsavel_id = $1', [id]);
    // Vincula os novos alunos
    const alunosIds = Array.isArray(alunos) ? alunos.map(Number).filter(n => !isNaN(n)) : [];
    if (alunosIds.length > 0) {
      const updateResult = await pool.query('UPDATE alunos SET responsavel_id = $1 WHERE id = ANY($2::int[])', [id, alunosIds]);
      console.log('Resultado do update de alunos:', updateResult.rowCount, 'IDs:', alunosIds);
    } else {
      console.log('Nenhum aluno para vincular. Array recebido:', alunos);
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar responsável:', err);
    res.status(500).json({ erro: 'Erro ao atualizar responsável' });
  }
};

// Exclui um responsável
const excluirResponsavel = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM responsaveis WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Responsável não encontrado' });
    }
    res.json({ sucesso: true });
  } catch (err) {
    console.error('Erro ao excluir responsável:', err);
    res.status(500).json({ erro: 'Erro ao excluir responsável' });
  }
};

module.exports = {
  listarResponsaveis,
  buscarResponsavelPorId,
  criarResponsavel,
  atualizarResponsavel,
  excluirResponsavel
};
