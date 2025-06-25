// Controller para mensalidades
const pool = require('../config/pg');

const listarMensalidades = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT m.*, a.nome AS aluno_nome, t.nome AS turma_nome
      FROM mensalidades m
      LEFT JOIN alunos a ON m.aluno_id = a.id
      LEFT JOIN turmas t ON m.turma_id = t.id
      ORDER BY m.id
    `);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar mensalidades:', err);
    res.status(500).json({ erro: 'Erro ao buscar mensalidades' });
  }
};

const criarMensalidade = async (req, res) => {
  try {
    console.log('Payload recebido:', req.body); // Log para debug
    const { aluno_id, turma_id, referencia_mes, valor, status, data_pagamento, forma_pagamento, data_vencimento } = req.body;
    // Validação: valor deve ser número
    if (isNaN(Number(valor)) || Number(valor) <= 0) {
      return res.status(400).json({ erro: 'O valor deve ser um número maior que zero.' });
    }
    if (!data_vencimento) {
      return res.status(400).json({ erro: 'Data de vencimento obrigatória.' });
    }
    const dataPagamentoFinal = data_pagamento ? data_pagamento : null;
    const result = await pool.query(
      'INSERT INTO mensalidades (aluno_id, turma_id, referencia_mes, valor, status, data_pagamento, forma_pagamento, data_vencimento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [aluno_id, turma_id, referencia_mes, valor, status, dataPagamentoFinal, forma_pagamento, data_vencimento]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar mensalidade:', err);
    res.status(500).json({ erro: 'Erro ao criar mensalidade' });
  }
};

const atualizarMensalidade = async (req, res) => {
  try {
    const { id } = req.params;
    const { aluno_id, turma_id, referencia_mes, valor, status, data_pagamento, forma_pagamento, data_vencimento } = req.body;
    // Corrige data_pagamento: se vier vazio, envia null
    const dataPagamentoFinal = data_pagamento ? data_pagamento : null;
    const result = await pool.query(
      'UPDATE mensalidades SET aluno_id=$1, turma_id=$2, referencia_mes=$3, valor=$4, status=$5, data_pagamento=$6, forma_pagamento=$7, data_vencimento=$8 WHERE id=$9 RETURNING *',
      [aluno_id, turma_id, referencia_mes, valor, status, dataPagamentoFinal, forma_pagamento, data_vencimento, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ erro: 'Mensalidade não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar mensalidade:', err);
    res.status(500).json({ erro: 'Erro ao atualizar mensalidade' });
  }
};

const deletarMensalidade = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM mensalidades WHERE id=$1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ erro: 'Mensalidade não encontrada' });
    res.status(204).end();
  } catch (err) {
    console.error('Erro ao deletar mensalidade:', err);
    res.status(500).json({ erro: 'Erro ao deletar mensalidade' });
  }
};

module.exports = {
  listarMensalidades,
  criarMensalidade,
  atualizarMensalidade,
  deletarMensalidade
};
