import React, { useEffect, useState } from 'react';
import AlunoList from '../components/AlunoList';
import CadastroAluno from '../components/CadastroAluno';
import RelatorioGeral from '../components/RelatorioGeral';
import ProfessorList from '../components/ProfessorList';
import ResponsavelList from '../components/ResponsavelList';
import DisciplinaList from '../components/DisciplinaList';
import MensalidadeList from '../components/MensalidadeList';
import TurmaList from '../components/TurmaList';
import '../styles/global.scss';

type Aluno = {
  id: number;
  nome: string;
  turma_id?: number;
  // outros campos opcionais
};
type Turma = { id: number; nome: string };
type Responsavel = {
  id: number;
  nome: string;
  parentesco: string;
  telefone: string;
  email: string;
  endereco: string;
};

const App: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [loadingTurmas, setLoadingTurmas] = useState(false);
  const [loadingResponsaveis, setLoadingResponsaveis] = useState(false);
  const [aba, setAba] = useState('alunos');

  const fetchAlunos = () => {
    setLoadingAlunos(true);
    fetch('/alunos')
      .then(res => res.json())
      .then(setAlunos)
      .finally(() => setLoadingAlunos(false));
  };
  const fetchTurmas = () => {
    setLoadingTurmas(true);
    fetch('/turmas')
      .then(res => res.json())
      .then(setTurmas)
      .finally(() => setLoadingTurmas(false));
  };
  const fetchResponsaveis = () => {
    setLoadingResponsaveis(true);
    fetch('/responsaveis')
      .then(res => res.json())
      .then(setResponsaveis)
      .finally(() => setLoadingResponsaveis(false));
  };

  useEffect(() => {
    fetchAlunos();
    fetchTurmas();
    fetchResponsaveis();
  }, []);

  return (
    <>
      <header>
        <h1>Sistema de Gerenciamento Escolar Infantil - Backend</h1>
        <p>Organização, clareza e eficiência no gerenciamento escolar.</p>
      </header>
      <nav style={{ display: 'flex', gap: 16, margin: '24px 0' }}>
        <button className={aba === 'alunos' ? 'btn-pill active' : 'btn-pill'} onClick={() => setAba('alunos')}>Alunos</button>
        <button className={aba === 'professores' ? 'btn-pill active' : 'btn-pill'} onClick={() => setAba('professores')}>Professores</button>
        <button className={aba === 'turmas' ? 'btn-pill active' : 'btn-pill'} onClick={() => setAba('turmas')}>Turmas</button>
        <button className={aba === 'responsaveis' ? 'btn-pill active' : 'btn-pill'} onClick={() => setAba('responsaveis')}>Responsáveis</button>
        <button className={aba === 'disciplinas' ? 'btn-pill active' : 'btn-pill'} onClick={() => setAba('disciplinas')}>Disciplinas</button>
        <button className={aba === 'mensalidades' ? 'btn-pill active' : 'btn-pill'} onClick={() => setAba('mensalidades')}>Mensalidades</button>
        <button className={aba === 'relatorio' ? 'btn-pill active' : 'btn-pill'} onClick={() => setAba('relatorio')}>Relatório Geral</button>
      </nav>
      <main className="container">
        {aba === 'alunos' && (
          <section className="section-card">
            <CadastroAluno turmas={turmas} fetchAlunos={fetchAlunos} fetchResponsaveis={fetchResponsaveis} />
            <AlunoList alunos={alunos} turmas={turmas} fetchAlunos={fetchAlunos} loading={loadingAlunos} />
          </section>
        )}
        {aba === 'professores' && (
          <section className="section-card">
            <ProfessorList />
          </section>
        )}
        {aba === 'turmas' && (
          <section className="section-card">
            <TurmaList />
          </section>
        )}
        {aba === 'responsaveis' && (
          <section className="section-card">
            <ResponsavelList responsaveis={responsaveis} loading={loadingResponsaveis} fetchResponsaveis={fetchResponsaveis} />
          </section>
        )}
        {aba === 'disciplinas' && (
          <section className="section-card">
            <DisciplinaList />
          </section>
        )}
        {aba === 'mensalidades' && (
          <section className="section-card">
            <MensalidadeList />
          </section>
        )}
        {aba === 'relatorio' && (
          <section className="section-card">
            <RelatorioGeral />
          </section>
        )}
      </main>
    </>
  );
};

export default App;
