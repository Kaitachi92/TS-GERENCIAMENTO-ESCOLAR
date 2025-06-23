import React, { useEffect, useState } from 'react';
import './AlunoList.scss';

type Aluno = { id: number; nome: string; turma_id?: number };
type Turma = { id: number; nome: string };
type Professor = { id: number; nome: string; turmas?: number[] };

const RelatorioGeral: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);

  // Função para buscar todos os dados
  const fetchAll = () => {
    fetch('/alunos').then(res => res.json()).then(setAlunos);
    fetch('/turmas').then(res => res.json()).then(setTurmas);
    fetch('/professores').then(res => res.json()).then(setProfessores);
  };

  useEffect(() => {
    fetchAll();
    // Atualiza a cada 2 segundos para refletir mudanças sem recarregar
    const interval = setInterval(fetchAll, 2000);
    return () => clearInterval(interval);
  }, []);

  // Função auxiliar para mostrar nomes dos professores vinculados à turma do aluno
  function getProfessoresDaTurma(turmaId: number | undefined) {
    if (!turmaId) return '-';
    const profs = professores.filter(p => Array.isArray(p.turmas) && p.turmas.includes(turmaId));
    return profs.length > 0 ? profs.map(p => p.nome).join(', ') : '-';
  }

  return (
    <div className="aluno-list">
      <h2>Alunos, Turmas e Professores</h2>
      <table className="api-table">
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Turma</th>
            <th>Professor(es)</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map(aluno => {
            const turma = turmas.find(t => t.id === aluno.turma_id);
            return (
              <tr key={aluno.id}>
                <td>{aluno.nome}</td>
                <td>{turma ? turma.nome : '-'}</td>
                <td>{getProfessoresDaTurma(aluno.turma_id)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RelatorioGeral;
