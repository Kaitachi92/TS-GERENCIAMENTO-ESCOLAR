// Teste de POST para mensalidades
const fetch = require('node-fetch');

async function testarPostMensalidade() {
  const response = await fetch('http://localhost:3000/mensalidades', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aluno_id: 1, // ajuste para um ID válido existente
      turma_id: 1, // ajuste para um ID válido existente
      referencia_mes: '06/2025',
      valor: '500',
      status: 'Em Aberto',
      data_pagamento: null,
      forma_pagamento: null
    })
  });
  const data = await response.json();
  console.log('Resposta do backend:', data);
}

testarPostMensalidade();
