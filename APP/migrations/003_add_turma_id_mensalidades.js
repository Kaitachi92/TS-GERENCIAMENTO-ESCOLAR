exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('mensalidades', {
    turma_id: { type: 'integer', references: 'turmas', onDelete: 'set null' }
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('mensalidades', 'turma_id');
};
