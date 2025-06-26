# 📊 Diagramas de Fluxo de Dados (DFD) - Sistema de Gerenciamento Escolar

## 🎯 DFD Nível 0 - Diagrama de Contexto

```mermaid
graph TD
    %% Entidades Externas
    E1[Responsáveis<br/>Legais]
    E2[Corpo<br/>Docente]
    E3[Discentes]
    E4[Gestores<br/>Administrativos]
    
    %% Sistema Central
    P0[Sistema de Gestão<br/>Educacional Integrado<br/>SGEI]
    
    %% Fluxos de Entrada
    E1 -->|Dados Cadastrais<br/>Solicitações<br/>Pagamentos| P0
    E2 -->|Registros Acadêmicos<br/>Avaliações<br/>Frequência| P0
    E3 -->|Consultas<br/>Solicitações<br/>Empréstimos| P0
    E4 -->|Parâmetros do Sistema<br/>Configurações| P0
    
    %% Fluxos de Saída
    P0 -->|Relatórios Gerenciais<br/>Indicadores<br/>Dashboards| E4
    P0 -->|Boletins<br/>Histórico Escolar<br/>Notificações| E1
    P0 -->|Planejamento<br/>Cronogramas<br/>Comunicados| E2
    P0 -->|Consultas<br/>Comprovantes<br/>Certificados| E3
    
    %% Estilos
    classDef entidade fill:#f8f9fa,stroke:#495057,stroke-width:2px
    classDef sistema fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    
    class E1,E2,E3,E4 entidade
    class P0 sistema
```

---

## 🔍 DFD Nível 1 - Processos Detalhados

```mermaid
graph TD
    %% Entidades Externas
    RESP[👥 Responsáveis]
    PROF[👨‍🏫 Professores] 
    ALUNO[👨‍🎓 Alunos]
    ADM[👩‍💼 Administrador]
    
    %% Processos
    P1[1.0<br/>📝 Gestão de<br/>Matrículas]
    P2[2.0<br/>📚 Gestão<br/>Acadêmica]
    P3[3.0<br/>💰 Gestão<br/>Financeira]
    P4[4.0<br/>📖 Gestão de<br/>Biblioteca]
    P5[5.0<br/>📊 Geração de<br/>Relatórios]
    
    %% Depósitos de Dados
    D1[(D1<br/>👨‍🎓 Alunos)]
    D2[(D2<br/>👥 Responsáveis)]
    D3[(D3<br/>👨‍🏫 Professores)]
    D4[(D4<br/>🏫 Turmas)]
    D5[(D5<br/>💵 Mensalidades)]
    D6[(D6<br/>📚 Livros)]
    D7[(D7<br/>📝 Ocorrências)]
    
    %% Fluxos - Gestão de Matrículas
    RESP -->|Dados do aluno| P1
    P1 -->|Cadastra| D1
    P1 -->|Vincula| D2
    P1 -->|Aloca turma| D4
    
    %% Fluxos - Gestão Acadêmica
    PROF -->|Notas e frequência| P2
    ALUNO -->|Consultas| P2
    P2 -->|Atualiza dados| D1
    P2 -->|Registra ocorrências| D7
    P2 -->|Consulta turmas| D4
    D3 -->|Dados do professor| P2
    
    %% Fluxos - Gestão Financeira
    RESP -->|Pagamentos| P3
    P3 -->|Gera mensalidades| D5
    D1 -->|Dados do aluno| P3
    P3 -->|Comprovantes| RESP
    
    %% Fluxos - Gestão de Biblioteca
    ALUNO -->|Solicita empréstimo| P4
    P4 -->|Consulta acervo| D6
    D1 -->|Dados do aluno| P4
    P4 -->|Registra empréstimo| D6
    
    %% Fluxos - Relatórios
    ADM -->|Solicita relatórios| P5
    D1 -->|Dados alunos| P5
    D5 -->|Dados financeiros| P5
    D7 -->|Dados ocorrências| P5
    P5 -->|Relatórios| ADM
    
    %% Estilos
    classDef processo fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef deposito fill:#f1f8e9,stroke:#689f38,stroke-width:2px
    classDef entidade fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class P1,P2,P3,P4,P5 processo
    class D1,D2,D3,D4,D5,D6,D7 deposito
    class RESP,PROF,ALUNO,ADM entidade
```

---

## 🔬 DFD Nível 2 - Detalhamento do Processo 2.0 (Gestão Acadêmica)

```mermaid
graph TD
    %% Entidades Externas
    PROF[👨‍🏫 Professores]
    ALUNO[👨‍🎓 Alunos]
    
    %% Subprocessos
    P21[2.1<br/>📝 Lançamento<br/>de Notas]
    P22[2.2<br/>📅 Controle de<br/>Frequência]
    P23[2.3<br/>📋 Registro de<br/>Ocorrências]
    P24[2.4<br/>📊 Consulta de<br/>Desempenho]
    
    %% Depósitos
    D1[(D1<br/>Alunos)]
    D3[(D3<br/>Professores)]
    D4[(D4<br/>Turmas)]
    D7[(D7<br/>Ocorrências)]
    D8[(D8<br/>Avaliações)]
    D9[(D9<br/>Frequência)]
    
    %% Fluxos
    PROF -->|Notas das avaliações| P21
    P21 -->|Armazena notas| D8
    D1 -->|Dados do aluno| P21
    D4 -->|Dados da turma| P21
    
    PROF -->|Registro de presença| P22
    P22 -->|Atualiza frequência| D9
    D1 -->|Lista de alunos| P22
    
    PROF -->|Relato de ocorrência| P23
    P23 -->|Registra ocorrência| D7
    D1 -->|Dados do aluno| P23
    D3 -->|Dados do professor| P23
    
    ALUNO -->|Consulta desempenho| P24
    D8 -->|Notas| P24
    D9 -->|Frequência| P24
    P24 -->|Boletim| ALUNO
    
    %% Estilos
    classDef subprocesso fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    classDef deposito fill:#f1f8e9,stroke:#689f38,stroke-width:2px
    classDef entidade fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class P21,P22,P23,P24 subprocesso
    class D1,D3,D4,D7,D8,D9 deposito
    class PROF,ALUNO entidade
```

---

## 📋 Especificações Técnicas dos Fluxos

### **DFD Nível 0:**
- **F1**: Dados cadastrais, solicitações de matrícula, pagamentos
- **F2**: Registros acadêmicos, avaliações, controle de frequência
- **F3**: Consultas acadêmicas, solicitações de biblioteca
- **F4**: Parâmetros do sistema, configurações administrativas
- **F5**: Relatórios gerenciais, indicadores de performance
- **F6**: Boletins, histórico escolar, notificações
- **F7**: Planejamento acadêmico, cronogramas, comunicados
- **F8**: Consultas aprovadas, comprovantes, certificados

### **DFD Nível 1:**
- **Processo 1.0**: Gerencia todo o ciclo de vida das matrículas
- **Processo 2.0**: Controla atividades acadêmicas e pedagógicas
- **Processo 3.0**: Administra mensalidades e pagamentos
- **Processo 4.0**: Gerencia empréstimos e acervo bibliográfico
- **Processo 5.0**: Gera relatórios e indicadores de gestão

### **Depósitos de Dados:**
- **D1-D7**: Armazenam dados persistentes do sistema
- **Integridade**: Relacionamentos com chaves estrangeiras
- **Backup**: Rotinas automatizadas de backup
- **Segurança**: Controle de acesso por perfil de usuário
