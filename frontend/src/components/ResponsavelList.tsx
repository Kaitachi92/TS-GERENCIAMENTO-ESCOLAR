import React from 'react';

interface Responsavel {
  id: number;
  nome: string;
  parentesco: string;
  telefone: string;
  email: string;
  endereco: string;
}

type Props = {
  responsaveis: Responsavel[];
  loading: boolean;
  fetchResponsaveis: () => void;
};

const ResponsavelList: React.FC<Props> = ({ responsaveis, loading }) => {
  return (
    <div className="aluno-list">
      <h2>Lista de Responsáveis</h2>
      {loading ? <p>Carregando...</p> : (
        <ul>
          {responsaveis.map(r => (
            <li key={r.id}>
              <b>{r.nome}</b> ({r.parentesco}) - {r.telefone} - {r.email} - {r.endereco}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResponsavelList;
