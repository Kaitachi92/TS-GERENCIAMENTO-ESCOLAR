exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('mensalidades', {
    forma_pagamento: { type: 'varchar(50)' }
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('mensalidades', 'forma_pagamento');
};
