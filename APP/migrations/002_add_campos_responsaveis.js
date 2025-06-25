// Migration para adicionar colunas faltantes em responsaveis
module.exports = {
  up: async (pgm) => {
    pgm.addColumns('responsaveis', {
      cpf: { type: 'varchar(20)' },
      observacoes: { type: 'text' },
      pagador_principal: { type: 'boolean' },
      acesso_portal: { type: 'boolean' },
      doc_pendente: { type: 'boolean' }
    });
  },
  down: async (pgm) => {
    pgm.dropColumns('responsaveis', [
      'cpf',
      'observacoes',
      'pagador_principal',
      'acesso_portal',
      'doc_pendente'
    ]);
  }
};
