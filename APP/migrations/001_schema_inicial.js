// Migration inicial baseada no banco.sql
module.exports = {
  up: async (pgm) => {
    // Responsáveis
    pgm.createTable('responsaveis', {
      id: { type: 'serial', primaryKey: true },
      nome: { type: 'varchar(100)', notNull: true },
      parentesco: 'varchar(40)',
      telefone: 'varchar(20)',
      email: 'varchar(120)',
      endereco: 'varchar(200)'
    });
    // Alunos
    pgm.createTable('alunos', {
      id: { type: 'serial', primaryKey: true },
      nome: { type: 'varchar(100)', notNull: true },
      data_nascimento: 'date',
      cpf: 'varchar(14)',
      rg: 'varchar(20)',
      sexo: 'varchar(10)',
      endereco: 'varchar(200)',
      email: 'varchar(120)',
      telefone: 'varchar(20)',
      responsavel_id: { type: 'integer', references: 'responsaveis', onDelete: 'set null' }
    });
    // Turmas
    pgm.createTable('turmas', {
      id: { type: 'serial', primaryKey: true },
      nome: { type: 'varchar(100)', notNull: true },
      ano_letivo: 'integer',
      turno: 'varchar(20)',
      nivel_ensino: 'varchar(40)'
    });
    // Professores
    pgm.createTable('professores', {
      id: { type: 'serial', primaryKey: true },
      nome: { type: 'varchar(100)', notNull: true },
      formacao: 'varchar(100)',
      email: 'varchar(120)',
      telefone: 'varchar(20)'
    });
    // Disciplinas
    pgm.createTable('disciplinas', {
      id: { type: 'serial', primaryKey: true },
      nome: { type: 'varchar(100)', notNull: true },
      carga_horaria: 'integer',
      ano_serie: 'integer'
    });
    // Usuários
    pgm.createTable('usuarios', {
      id: { type: 'serial', primaryKey: true },
      nome: { type: 'varchar(100)', notNull: true },
      email: { type: 'varchar(120)', notNull: true, unique: true },
      senha_hash: { type: 'varchar(200)', notNull: true },
      tipo_usuario: { type: 'varchar(20)', notNull: true }
    });
    // Mensalidades
    pgm.createTable('mensalidades', {
      id: { type: 'serial', primaryKey: true },
      aluno_id: { type: 'integer', references: 'alunos', notNull: true, onDelete: 'cascade' },
      referencia_mes: { type: 'varchar(7)', notNull: true },
      valor: { type: 'numeric(10,2)', notNull: true },
      status: { type: 'varchar(20)', notNull: true },
      data_vencimento: { type: 'date', notNull: true },
      data_pagamento: 'date'
    });
    // Livros
    pgm.createTable('livros', {
      id: { type: 'serial', primaryKey: true },
      titulo: { type: 'varchar(200)', notNull: true },
      autor: 'varchar(100)',
      editora: 'varchar(100)',
      ano: 'integer',
      isbn: 'varchar(30)',
      quantidade_total: { type: 'integer', notNull: true },
      quantidade_disponivel: { type: 'integer', notNull: true }
    });
    // Empréstimos
    pgm.createTable('emprestimos', {
      id: 'serial',
      livro_id: { type: 'integer', references: 'livros', notNull: true, onDelete: 'cascade' },
      aluno_id: { type: 'integer', references: 'alunos', notNull: true, onDelete: 'cascade' },
      data_emprestimo: { type: 'date', notNull: true },
      data_devolucao: 'date',
      status: 'varchar(20)'
    });
    // Eventos
    pgm.createTable('eventos', {
      id: 'serial',
      titulo: { type: 'varchar(120)', notNull: true },
      descricao: 'text',
      data_inicio: { type: 'date', notNull: true },
      data_fim: 'date',
      tipo_evento: 'varchar(40)'
    });
    // Calendário letivo
    pgm.createTable('calendario_letivo', {
      id: 'serial',
      data: { type: 'date', notNull: true },
      descricao: 'varchar(200)',
      letivo: { type: 'boolean', notNull: true }
    });
    // Avisos
    pgm.createTable('avisos', {
      id: 'serial',
      titulo: { type: 'varchar(120)', notNull: true },
      mensagem: { type: 'text', notNull: true },
      destinatario_tipo: 'varchar(20)',
      data_envio: { type: 'timestamp', notNull: true },
      autor_id: { type: 'integer', references: 'usuarios' }
    });
    // Ocorrências
    pgm.createTable('ocorrencias', {
      id: 'serial',
      aluno_id: { type: 'integer', references: 'alunos', notNull: true, onDelete: 'cascade' },
      descricao: { type: 'text', notNull: true },
      tipo_ocorrencia: 'varchar(30)',
      data: { type: 'date', notNull: true },
      professor_id: { type: 'integer', references: 'professores' }
    });
    // Professor_Turma
    pgm.createTable('professor_turma', {
      id: { type: 'serial', primaryKey: true },
      professor_id: { type: 'integer', references: 'professores', notNull: true, onDelete: 'CASCADE' },
      turma_id: { type: 'integer', references: 'turmas', notNull: true, onDelete: 'CASCADE' }
    });
    // Professores_Disciplinas
    pgm.createTable('professores_disciplinas', {
      professor_id: { type: 'integer', references: 'professores', notNull: true, onDelete: 'CASCADE' },
      disciplina_id: { type: 'integer', references: 'disciplinas', notNull: true, onDelete: 'CASCADE' },
      turma_id: { type: 'integer', references: 'turmas', notNull: true, onDelete: 'CASCADE' }
    }, {
      primaryKey: ['professor_id', 'disciplina_id', 'turma_id']
    });
  },
  down: async (pgm) => {
    pgm.dropTable('professores_disciplinas');
    pgm.dropTable('professor_turma');
    pgm.dropTable('ocorrencias');
    pgm.dropTable('avisos');
    pgm.dropTable('calendario_letivo');
    pgm.dropTable('eventos');
    pgm.dropTable('emprestimos');
    pgm.dropTable('livros');
    pgm.dropTable('pagamentos');
    pgm.dropTable('mensalidades');
    pgm.dropTable('acessos');
    pgm.dropTable('usuarios');
    pgm.dropTable('historico_escolar');
    pgm.dropTable('frequencias');
    pgm.dropTable('avaliacoes');
    pgm.dropTable('professores_disciplinas');
    pgm.dropTable('disciplinas');
    pgm.dropTable('professor_turma');
    pgm.dropTable('professores');
    pgm.dropTable('turmas');
    pgm.dropTable('alunos');
    pgm.dropTable('responsaveis');
  }
};
