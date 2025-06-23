import React, { useState } from 'react';
import './AlunoList.scss';

type Aluno = {
  id: number;
  nome: string;
  turma_id?: number;
};
type Turma = { id: number; nome: string };

type Props = {
  alunos: Aluno[];
  turmas: Turma[];
  fetchAlunos: () => void;
  loading: boolean;
};

const AlunoList: React.FC<Props> = ({ alunos, turmas, fetchAlunos, loading }) => {
  const [editId, setEditId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editTurmaId, setEditTurmaId] = useState<number | ''>('');
  const [search, setSearch] = useState('');

  const handleDelete = async (id: number) => {
    await fetch(`/alunos/${id}`, { method: 'DELETE' });
    fetchAlunos();
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
    fetchAlunos();
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
        />
        <button className="btn-pill" type="button" onClick={() => setSearch('')}>Limpar</button>
      </div>
      {loading ? <p>Carregando...</p> : (
        <ul>
          {alunos
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
                    />
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
