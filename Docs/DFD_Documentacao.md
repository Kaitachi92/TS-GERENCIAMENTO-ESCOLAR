# Diagrama de Fluxo de Dados (DFD) - Sistema de Gerenciamento Escolar

## Visão Geral

Este documento apresenta os Diagramas de Fluxo de Dados (DFD) para o Sistema de Gerenciamento Escolar, desenvolvidos em dois níveis hierárquicos para mostrar diferentes graus de detalhamento dos processos de negócio.

## DFD Nível 0 (Diagrama de Contexto)

O **DFD de Nível 0** apresenta uma visão macro do sistema, mostrando:

### Entidades Externas:
- **Administrador**: Responsável pela gestão geral do sistema
- **Responsável**: Pais/responsáveis pelos alunos
- **Professor**: Educadores que acessam informações das turmas

### Sistema Central:
- **Sistema de Gerenciamento Escolar**: Processo único que representa todo o sistema

### Armazenamentos de Dados:
- **D1: Dados de Alunos** - Informações dos alunos e responsáveis
- **D2: Dados de Turmas** - Informações das turmas e disciplinas
- **D3: Dados de Professores** - Cadastro dos professores
- **D4: Dados Financeiros** - Controle de mensalidades

### Principais Fluxos:
- Entrada de dados de cadastro pelo administrador
- Consultas de informações por responsáveis e professores
- Retorno de relatórios e informações solicitadas
- Persistência e recuperação de dados nos armazenamentos

## DFD Nível 1 (Decomposição de Processos)

O **DFD de Nível 1** detalha os processos internos do sistema:

### Processos Identificados:

#### 1.0 - Gerenciar Alunos
- **Função**: Cadastrar, alterar, excluir e consultar informações de alunos
- **Entradas**: Dados do aluno (nome, data nascimento, responsável)
- **Saídas**: Confirmações de cadastro, listas de alunos
- **Armazenamentos**: D1 (Alunos), D2 (Responsáveis)

#### 2.0 - Gerenciar Turmas
- **Função**: Criar e gerenciar turmas, vincular alunos
- **Entradas**: Dados da turma (nome, série, professor)
- **Saídas**: Confirmações, listas de turmas
- **Armazenamentos**: D3 (Turmas)

#### 3.0 - Gerenciar Professores
- **Função**: Cadastrar professores e disciplinas
- **Entradas**: Dados do professor (nome, disciplina, contato)
- **Saídas**: Confirmações de cadastro
- **Armazenamentos**: D4 (Professores), D5 (Disciplinas)

#### 4.0 - Gerenciar Mensalidades
- **Função**: Controlar pagamentos e mensalidades
- **Entradas**: Dados de pagamento, valores
- **Saídas**: Comprovantes, status de pagamento
- **Armazenamentos**: D6 (Mensalidades)

#### 5.0 - Gerar Relatórios
- **Função**: Produzir relatórios gerenciais
- **Entradas**: Parâmetros dos relatórios
- **Saídas**: Relatórios formatados
- **Armazenamentos**: Lê de todos os armazenamentos

#### 6.0 - Consultar Informações
- **Função**: Permitir consultas por responsáveis e professores
- **Entradas**: Parâmetros de consulta
- **Saídas**: Informações solicitadas
- **Armazenamentos**: D1, D2, D6 (conforme necessário)

## Estrutura dos Armazenamentos

### D1: Alunos
```sql
- id (chave primária)
- nome
- data_nascimento
- turma_id (chave estrangeira)
- responsavel_id (chave estrangeira)
```

### D2: Responsáveis
```sql
- id (chave primária)
- nome
- telefone
- email
- parentesco
```

### D3: Turmas
```sql
- id (chave primária)
- nome
- serie
- professor_id (chave estrangeira)
```

### D4: Professores
```sql
- id (chave primária)
- nome
- telefone
- email
- disciplina
```

### D5: Disciplinas
```sql
- id (chave primária)
- nome
- carga_horaria
```

### D6: Mensalidades
```sql
- id (chave primária)
- aluno_id (chave estrangeira)
- valor
- data_vencimento
- data_pagamento
- status
- forma_pagamento
```

## Características dos DFDs

### Notação Utilizada:
- **Retângulos**: Entidades externas (fontes e destinos de dados)
- **Círculos**: Processos de transformação de dados
- **Retângulos abertos**: Armazenamentos de dados
- **Setas**: Fluxos de dados com rótulos descritivos

### Princípios Seguidos:
1. **Conservação de Dados**: Todo dado que entra deve sair ou ser armazenado
2. **Balanceamento**: Fluxos entre níveis devem ser consistentes
3. **Numeração**: Processos numerados hierarquicamente
4. **Nomenclatura**: Nomes claros e descritivos para todos os elementos

## Benefícios dos DFDs para o Projeto

1. **Documentação**: Registro claro dos processos de negócio
2. **Comunicação**: Facilita entendimento entre stakeholders
3. **Análise**: Identifica fluxos de dados e dependências
4. **Design**: Base para arquitetura do sistema
5. **Validação**: Verificação de completude dos requisitos

## Arquivos Gerados

- `DFD_Sistema_Gerenciamento_Escolar.svg` - DFD Nível 0
- `DFD_Nivel1_Sistema_Gerenciamento_Escolar.svg` - DFD Nível 1
- `DFD_Documentacao.md` - Esta documentação

Os diagramas foram criados em formato SVG para garantir qualidade visual e facilidade de visualização em navegadores e editores.
