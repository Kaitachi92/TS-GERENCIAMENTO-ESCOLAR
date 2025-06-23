-- DDL do MER para Sistema de Gerenciamento Escolar Infantil
-- Exemplo básico com as entidades principais: aluno, turma e professor

-- Remover tabelas no singular e garantir uso das tabelas no plural
-- DROP TABLE IF EXISTS professor;
-- DROP TABLE IF EXISTS turma;
-- DROP TABLE IF EXISTS aluno;

-- 🧑‍🎓 Alunos e Matrículas
CREATE TABLE responsaveis (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    parentesco VARCHAR(40),
    telefone VARCHAR(20),
    email VARCHAR(120),
    endereco VARCHAR(200)
);
CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE,
    cpf VARCHAR(14),
    rg VARCHAR(20),
    sexo VARCHAR(10),
    endereco VARCHAR(200),
    email VARCHAR(120),
    telefone VARCHAR(20),
    responsavel_id INTEGER REFERENCES responsaveis(id)
);
CREATE TABLE turmas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ano_letivo INTEGER,
    turno VARCHAR(20),
    nivel_ensino VARCHAR(40)
);
CREATE TABLE professores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    formacao VARCHAR(100),
    email VARCHAR(120),
    telefone VARCHAR(20)
);

-- Tabela de relacionamento professor-turma (deve ser criada após professores e turmas)
DROP TABLE IF EXISTS professor_turma;
CREATE TABLE professor_turma (
    id SERIAL PRIMARY KEY,
    professor_id INTEGER REFERENCES professores(id),
    turma_id INTEGER REFERENCES turmas(id)
);


-- 📚 Acadêmico
CREATE TABLE disciplinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    carga_horaria INTEGER,
    ano_serie INTEGER
);
CREATE TABLE professores_disciplinas (
    professor_id INTEGER NOT NULL REFERENCES professores(id) ON DELETE CASCADE,
    disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
    turma_id INTEGER NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
    PRIMARY KEY (professor_id, disciplina_id, turma_id)
);
CREATE TABLE avaliacoes (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
    nota NUMERIC(5,2),
    data_avaliacao DATE,
    tipo VARCHAR(30)
);
CREATE TABLE frequencias (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    presente BOOLEAN NOT NULL
);
CREATE TABLE historico_escolar (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    ano INTEGER NOT NULL,
    disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
    nota_final NUMERIC(5,2),
    frequencia_total INTEGER,
    resultado VARCHAR(20)
);

-- 💻 Sistema e Acesso
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha_hash VARCHAR(200) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL
);
CREATE TABLE acessos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data_login TIMESTAMP NOT NULL,
    ip VARCHAR(40),
    dispositivo VARCHAR(80)
);

-- 💸 Financeiro
CREATE TABLE mensalidades (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    referencia_mes VARCHAR(7) NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE
);
CREATE TABLE pagamentos (
    id SERIAL PRIMARY KEY,
    mensalidade_id INTEGER NOT NULL REFERENCES mensalidades(id) ON DELETE CASCADE,
    forma_pagamento VARCHAR(40),
    comprovante_url VARCHAR(200)
);

-- 📖 Biblioteca
CREATE TABLE livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(100),
    editora VARCHAR(100),
    ano INTEGER,
    isbn VARCHAR(30),
    quantidade_total INTEGER NOT NULL,
    quantidade_disponivel INTEGER NOT NULL
);
CREATE TABLE emprestimos (
    id SERIAL PRIMARY KEY,
    livro_id INTEGER NOT NULL REFERENCES livros(id) ON DELETE CASCADE,
    aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    data_emprestimo DATE NOT NULL,
    data_devolucao DATE,
    status VARCHAR(20)
);

-- 📅 Eventos escolares e calendário
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    tipo_evento VARCHAR(40)
);
CREATE TABLE calendario_letivo (
    id SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    descricao VARCHAR(200),
    letivo BOOLEAN NOT NULL
);

-- 🗣️ Comunicação
CREATE TABLE avisos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    mensagem TEXT NOT NULL,
    destinatario_tipo VARCHAR(20),
    data_envio TIMESTAMP NOT NULL,
    autor_id INTEGER REFERENCES usuarios(id)
);
CREATE TABLE ocorrencias (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    tipo_ocorrencia VARCHAR(30),
    data DATE NOT NULL,
    professor_id INTEGER REFERENCES professores(id)
);
