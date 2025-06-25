import React, { useEffect, useState } from 'react';
import './AlunoList.scss';

type Turma = {
  id: number;
  nome: string;
};

// Adiciona prop opcional para notificar mudanças
const TurmaList: React.FC<{ onTurmasChange?: () => void }> = ({ onTurmasChange }) => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState('');

  // Sugestões de nomes de turmas para autocomplete
  const nomesTurmas = Array.from(new Set(turmas.map(t => t.nome)));

  const fetchTurmas = () => {
    setLoading(true);
    fetch('/turmas')
      .then(res => res.json())
      .then(data => setTurmas(data))
      .finally(() => setLoading(false));
    if (onTurmasChange) onTurmasChange();
  };

  useEffect(() => {
    fetchTurmas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await fetch(`/turmas/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: editNome })
      });
      setEditId(null);
      setEditNome('');
    } else {
      await fetch('/turmas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome })
      });
      setNome('');
    }
    fetchTurmas();
    if (onTurmasChange) onTurmasChange();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/turmas/${id}`, { method: 'DELETE' });
    fetchTurmas();
    if (onTurmasChange) onTurmasChange();
  };

  const handleEdit = (turma: Turma) => {
    setEditId(turma.id);
    setEditNome(turma.nome);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId === null || !editNome.trim()) return;
    await fetch(`/turmas/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: editNome })
    });
    setEditId(null);
    setEditNome('');
    fetchTurmas();
  };

  return (
    <div className="aluno-list">
      <h2>Lista de Turmas</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome da turma"
          style={{ flex: 1, borderRadius: 8, border: '1px solid #ccc', padding: 8 }}
          list="sugestoes-turma-cadastro"
        />
        <datalist id="sugestoes-turma-cadastro">
          {nomesTurmas.map(nome => (
            <option key={nome} value={nome} />
          ))}
        </datalist>
        <button className="btn-pill" type="submit">adicionar</button>
      </form>
      {loading ? <p>Carregando...</p> : (
        <ul>
          {turmas.map(turma => (
            <li key={turma.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {editId === turma.id ? (
                <form onSubmit={handleUpdate} style={{ display: 'flex', gap: 8, flex: 1 }}>
                  <input
                    type="text"
                    value={editNome}
                    onChange={e => setEditNome(e.target.value)}
                    style={{ flex: 1, borderRadius: 8, border: '1px solid #ccc', padding: 8 }}
                    list="sugestoes-turma-editar"
                  />
                  <datalist id="sugestoes-turma-editar">
                    {nomesTurmas.map(nome => (
                      <option key={nome} value={nome} />
                    ))}
                  </datalist>
                  <button className="btn-pill" type="submit">salvar</button>
                  <button className="btn-pill" type="button" onClick={() => setEditId(null)}>cancelar</button>
                </form>
              ) : (
                <>
                  <span style={{ flex: 1 }}>{turma.nome}</span>
                  <button className="btn-pill" type="button" onClick={() => handleEdit(turma)}>editar</button>
                  <button className="btn-pill" type="button" onClick={() => handleDelete(turma.id)} style={{ background: '#ffb3b3' }}>remover</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TurmaList;
