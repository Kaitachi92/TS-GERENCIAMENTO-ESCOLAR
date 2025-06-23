import React from 'react';
import './AlunoList.scss';

const ComoExecutar: React.FC = () => (
  <section className="como-executar">
    <h2>Como Executar o Projeto</h2>
    <h3>1. Subindo Backend, Banco de Dados e Proxy (Docker)</h3>
    <ol>
      <li>Abra o terminal na raiz do projeto.</li>
      <li>Execute:
        <pre>{`docker-compose build
# Depois
docker-compose up`}</pre>
      </li>
      <li>O backend estará acessível via nginx em <b>http://localhost</b>.</li>
      <li>O banco de dados estará disponível na porta <b>5432</b> (PostgreSQL).</li>
    </ol>
    <h3>2. Executando o Frontend</h3>
    <ol>
      <li>Abra um novo terminal e acesse a pasta <b>frontend</b>:</li>
      <li>
        <pre>{`cd frontend
npm install
npm run dev`}</pre>
      </li>
      <li>O frontend estará disponível em <b>http://localhost:5173</b>.</li>
      <li>O proxy do Vite já está configurado para encaminhar as requisições para o backend (porta 3000).</li>
    </ol>
  </section>
);

export default ComoExecutar;
