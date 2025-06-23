// Seed inicial para popular tabelas principais
module.exports = {
  handle: async function(pool) {
    // Responsáveis
    await pool.query(`
      INSERT INTO responsaveis (nome, parentesco, telefone, email, endereco) VALUES
        ('Maria Silva', 'Mãe', '11999999999', 'maria@email.com', 'Rua das Flores, 123'),
        ('João Souza', 'Pai', '11988888888', 'joao@email.com', 'Rua das Flores, 123')
    `);
    // Alunos
    await pool.query(`
      INSERT INTO alunos (nome, data_nascimento, cpf, rg, sexo, endereco, email, telefone, responsavel_id) VALUES
        ('Ana Souza', '2015-03-10', '123.456.789-00', 'MG-12.345.678', 'Feminino', 'Rua das Flores, 123', 'ana@email.com', '11977777777', 1),
        ('Pedro Silva', '2014-07-22', '987.654.321-00', 'MG-87.654.321', 'Masculino', 'Rua das Flores, 123', 'pedro@email.com', '11966666666', 2)
    `);
    // Turmas
    await pool.query(`
      INSERT INTO turmas (nome, ano_letivo, turno, nivel_ensino) VALUES
        ('1º Ano A', 2025, 'Manhã', 'Fundamental'),
        ('2º Ano B', 2025, 'Tarde', 'Fundamental')
    `);
    // Professores
    await pool.query(`
      INSERT INTO professores (nome, formacao, email, telefone) VALUES
        ('Carlos Lima', 'Pedagogia', 'carlos@email.com', '11955555555'),
        ('Fernanda Costa', 'Matemática', 'fernanda@email.com', '11944444444')
    `);
    // Relacionamento professor-turma
    await pool.query(`
      INSERT INTO professor_turma (professor_id, turma_id) VALUES
        (1, 1),
        (2, 2)
    `);
    // Disciplinas
    await pool.query(`
      INSERT INTO disciplinas (nome, carga_horaria, ano_serie) VALUES
        ('Matemática', 200, 1),
        ('Português', 200, 1)
    `);
    // Professores_disciplinas
    await pool.query(`
      INSERT INTO professores_disciplinas (professor_id, disciplina_id, turma_id) VALUES
        (1, 1, 1),
        (2, 2, 2)
    `);
  }
};
