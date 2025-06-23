import React, { useEffect, useState } from 'react';

interface Disciplina {
  id: number;
  nome: string;
  carga_horaria: number;
  ano_serie: number;
}

const DisciplinaList: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/disciplinas')
      .then(res => res.json())
      .then(setDisciplinas)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="aluno-list">
      <h2>Lista de Disciplinas</h2>
      {loading ? <p>Carregando...</p> : (
        <ul>
          {disciplinas.map(d => (
            <li key={d.id}>
              <b>{d.nome}</b> - {d.carga_horaria}h - Ano/Série: {d.ano_serie}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DisciplinaList;
