import React, { useState, useEffect } from 'react';
import './AlunoList.scss';

type Aluno = {
  id: number;
  nome: string;
  turma_id?: number;
};
type Turma = { id: number; nome: string };

type Props = {
  turmas: Turma[];
  fetchAlunos: () => void;
  loading: boolean;
};

const AlunoList: React.FC<Props> = ({ turmas, fetchAlunos, loading }) => {
  const [alunosState, setAlunosState] = useState<Aluno[]>([]);
  const [loadingState, setLoadingState] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editTurmaId, setEditTurmaId] = useState<number | ''>('');
  const [search, setSearch] = useState('');

  // Atualiza lista de alunos sempre que prop alunos mudar
  useEffect(() => {
    setAlunosState([]);
    setLoadingState(true);
    fetch('/alunos')
      .then(res => res.json())
      .then(setAlunosState)
      .finally(() => setLoadingState(false));
  }, [loading, turmas]);

  // Sugestões de nomes de alunos para autocomplete
  const nomesAlunos = Array.from(new Set(alunosState.map(a => a.nome)));

  const handleDelete = async (id: number) => {
    await fetch(`/alunos/${id}`, { method: 'DELETE' });
    setLoadingState(true);
    fetch('/alunos').then(res => res.json()).then(setAlunosState).finally(() => setLoadingState(false));
  };

  const handleEdit = (aluno: Aluno) => {
    setEditId(aluno.id);
    setEditNome(aluno.nome);
    setEditTurmaId(aluno.turma_id || '');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId === null || !editNome.trim() || !editTurmaId) return;
    await fetch(`/alunos/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: editNome, turma_id: editTurmaId })
    });
    setEditId(null);
    setEditNome('');
    setEditTurmaId('');
    setLoadingState(true);
    fetch('/alunos').then(res => res.json()).then(setAlunosState).finally(() => setLoadingState(false));
  };

  return (
    <div className="aluno-list">
      <h2>Lista de Alunos</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pesquisar aluno pelo nome"
          style={{ flex: 1, borderRadius: 8, border: '1px solid #ccc', padding: 8 }}
          list="sugestoes-aluno-busca"
        />
        <datalist id="sugestoes-aluno-busca">
          {nomesAlunos.map(nome => (
            <option key={nome} value={nome} />
          ))}
        </datalist>
        <button className="btn-pill" type="button" onClick={() => setSearch('')}>Limpar</button>
      </div>
      {loadingState ? <p>Carregando...</p> : (
        <ul>
          {alunosState
            .filter(aluno => aluno.nome.toLowerCase().includes(search.toLowerCase()))
            .map(aluno => (
              <li key={aluno.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {editId === aluno.id ? (
                  <form onSubmit={handleUpdate} style={{ display: 'flex', gap: 8, flex: 1 }}>
                    <input
                      type="text"
                      value={editNome}
                      onChange={e => setEditNome(e.target.value)}
                      style={{ flex: 1, borderRadius: 8, border: '1px solid #ccc', padding: 8 }}
                      list="sugestoes-aluno-editar"
                    />
                    <datalist id="sugestoes-aluno-editar">
                      {nomesAlunos.map(nome => (
                        <option key={nome} value={nome} />
                      ))}
                    </datalist>
                    <select
                      value={editTurmaId}
                      onChange={e => setEditTurmaId(Number(e.target.value))}
                      style={{ borderRadius: 8, border: '1px solid #ccc', padding: 8 }}
                    >
                      <option value="">Selecione a turma</option>
                      {turmas.map(turma => (
                        <option key={turma.id} value={turma.id}>{turma.nome}</option>
                      ))}
                    </select>
                    <button className="btn-pill" type="submit">salvar</button>
                    <button className="btn-pill" type="button" onClick={() => setEditId(null)}>cancelar</button>
                  </form>
                ) : (
                  <>
                    <span style={{ flex: 1 }}>{aluno.nome}</span>
                    <span style={{ color: '#888', fontSize: 13 }}>
                      {turmas.find(t => t.id === aluno.turma_id)?.nome || '-'}
                    </span>
                    <button className="btn-pill editar" type="button" onClick={() => handleEdit(aluno)}>editar</button>
                    <button className="btn-pill remover" type="button" onClick={() => handleDelete(aluno.id)}>remover</button>
                  </>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default AlunoList;
