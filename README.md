# Sistema de Gerenciamento Escolar Infantil

Um sistema completo para gestão de alunos, turmas, professores, responsáveis, mensalidades, biblioteca e eventos de uma escola infantil.

---

## Descrição

Este projeto visa facilitar o controle acadêmico, financeiro e administrativo de escolas infantis, centralizando informações de alunos, professores, turmas, responsáveis, mensalidades, biblioteca, eventos e mais. O sistema é composto por backend (Node.js/Express), frontend (React + TypeScript + Vite), banco de dados PostgreSQL e infraestrutura Docker.

---

## Tecnologias Utilizadas

- **Backend:** Node.js, Express, PostgreSQL, node-pg-migrate
- **Frontend:** React, TypeScript, Vite, Sass
- **Banco de Dados:** PostgreSQL
- **Infraestrutura:** Docker, Docker Compose, Nginx
- **Scripts:** PowerShell (`start-tudo.ps1`)

---

## Como Instalar/Configurar

### Pré-requisitos
- Docker e Docker Compose ([Download Docker Desktop](https://www.docker.com/products/docker-desktop/))
- Windows PowerShell (recomendado)
- Node.js (apenas se for rodar o frontend fora do Docker)

### Instalação Rápida (Recomendado)

Abra o PowerShell na raiz do projeto e execute:

```powershell
./start-tudo.ps1
```

Esse script irá:
- Derrubar containers antigos e volumes
- Subir backend, banco de dados e nginx
- Rodar as migrations e seeds automaticamente
- Subir o frontend (Vite) em uma nova janela

Acesse o frontend em: [http://localhost:5173](http://localhost:5173)
Acesse a API backend em: [http://localhost:3000](http://localhost:3000)

### Instalação Manual (Opcional)

```powershell
# (1) Construa as imagens Docker
./docker-compose build

# (2) Suba os containers
./docker-compose up -d --build

# (3) Rode as migrations
./docker-compose exec backend node run-migrations.js

# (4) Rode os seeds
./docker-compose exec backend node run-seeds.js

# (5) Suba o frontend
cd frontend
npm install
npm run dev
```

---

## Como Usar

- Acesse o frontend em [http://localhost:5173](http://localhost:5173) para utilizar o sistema via interface web.
- Acesse a API REST em [http://localhost:3000](http://localhost:3000) para integração ou testes com ferramentas como Postman.
- Exemplos de endpoints:
  - [http://localhost:3000/alunos](http://localhost:3000/alunos)
  - [http://localhost:3000/professores](http://localhost:3000/professores)
  - [http://localhost:3000/turmas](http://localhost:3000/turmas)
  - [http://localhost:3000/disciplinas](http://localhost:3000/disciplinas)
  - [http://localhost:3000/mensalidades](http://localhost:3000/mensalidades)

---

## Contribuição

Contribuições são bem-vindas! Para colaborar:

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nome-da-feature`)
3. Commit suas alterações (`git commit -m 'feat: nova funcionalidade'`)
4. Faça push para sua branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

**Regras:**
- Siga o padrão de código já existente (JavaScript/TypeScript padrão, nomes claros)
- Descreva claramente o que sua contribuição faz
- Sempre que possível, adicione testes e documentação

---

## Licença

Distribuído sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## Documentação Detalhada (Wiki)

Acesse a [Wiki do Projeto](https://github.com/SEU_USUARIO/SEU_REPOSITORIO/wiki) para:
- Visão geral arquitetural e diagramas
- Casos de uso detalhados
- Guia de desenvolvimento (estrutura de pastas, convenções, testes)
- Histórico de versões (Changelog)

---

## Observações
- O banco de dados é criado via migrations, não pelo banco.sql diretamente.
- Os dados iniciais são inseridos automaticamente via seeds.
- O frontend consome a API do backend para exibir e cadastrar dados.

---


