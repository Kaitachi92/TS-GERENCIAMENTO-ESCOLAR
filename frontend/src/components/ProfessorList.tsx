import React, { useEffect, useState } from 'react';
import './AlunoList.scss';

type Professor = { id: number; nome: string; turmas?: number[] };
type Turma = { id: number; nome: string };

type ProfessorTurma = { professor_id: number; turma_id: number };

const ProfessorList: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [nome, setNome] = useState('');
  const [turmaId, setTurmaId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [buscaTurma, setBuscaTurma] = useState('');

  // Sugestões de nomes para autocomplete
  const nomesProfessores = Array.from(new Set(professores.map(p => p.nome)));

  // Carrega professores do backend
  useEffect(() => {
    setLoading(true);
    fetch('/professores')
      .then(res => res.json())
      .then(data => setProfessores(data))
      .finally(() => setLoading(false));
    fetch('/turmas').then(res => res.json()).then(setTurmas);
  }, []);

  // Adiciona novo professor no backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validação: nome não pode ser vazio nem só número
    if (!nome.trim() || !isNaN(Number(nome)) || !turmaId || isNaN(Number(turmaId)) || Number(turmaId) <= 0) return;
    setLoading(true);
    await fetch('/professores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, turma_id: Number(turmaId) })
    });
    setNome('');
    setTurmaId('');
    fetch('/professores').then(res => res.json()).then(setProfessores).finally(() => setLoading(false));
  };

  // Função auxiliar para mostrar nomes das turmas vinculadas
  function getTurmasNomes(prof: any) {
    if (!Array.isArray(prof.turmas) || prof.turmas.length === 0) return '-';
    return prof.turmas
      .map((tid: number) => turmas.find(t => t.id === tid)?.nome)
      .filter(Boolean)
      .join(', ');
  }

  // Remove professor do backend
  const handleDelete = async (id: number) => {
    setLoading(true);
    await fetch(`/professores/${id}`, { method: 'DELETE' });
    fetch('/professores').then(res => res.json()).then(setProfessores).finally(() => setLoading(false));
  };

  return (
    <div className="aluno-list">
      <h2>Cadastro de Professores</h2>
      <input
        type="text"
        placeholder="Buscar por nome"
        value={busca}
        onChange={e => setBusca(e.target.value)}
        style={{ marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc', width: 300, marginRight: 8 }}
        list="sugestoes-prof-busca"
      />
      <datalist id="sugestoes-prof-busca">
        {nomesProfessores.map(nome => (
          <option key={nome} value={nome} />
        ))}
      </datalist>
      <select
        value={buscaTurma}
        onChange={e => setBuscaTurma(e.target.value)}
        style={{ marginBottom: 16, padding: 8, borderRadius: 8, border: '1px solid #ccc', width: 220 }}
      >
        <option value="">Filtrar por turma</option>
        {turmas.map(turma => (
          <option key={turma.id} value={turma.nome}>{turma.nome}</option>
        ))}
      </select>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome do professor"
          style={{ flex: 1, borderRadius: 8, border: '1px solid #ccc', padding: 8 }}
          list="sugestoes-prof-cadastro"
        />
        <datalist id="sugestoes-prof-cadastro">
          {nomesProfessores.map(nome => (
            <option key={nome} value={nome} />
          ))}
        </datalist>
        <select
          value={turmaId}
          onChange={e => setTurmaId(Number(e.target.value))}
          style={{ borderRadius: 8, border: '1px solid #ccc', padding: 8 }}
        >
          <option value="">Selecione a turma</option>
          {turmas.map(turma => (
            <option key={turma.id} value={turma.id}>{turma.nome}</option>
          ))}
        </select>
        <button className="btn-pill" type="submit">adicionar</button>
      </form>
      {/* Lista de professores e suas turmas */}
      <h2 style={{marginTop:32}}>Professores Cadastrados</h2>
      <table className="api-table">
        <thead>
          <tr>
            <th>Professor</th>
            <th>Turmas</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {professores.filter(p => {
            const nomeOk = p.nome.toLowerCase().includes(busca.toLowerCase());
            const turmaNomes = getTurmasNomes(p).toLowerCase();
            const turmaOk = !buscaTurma || turmaNomes.split(', ').includes(buscaTurma.toLowerCase());
            return nomeOk && turmaOk;
          }).length === 0 ? (
            <tr><td colSpan={3} style={{textAlign:'center'}}>Nenhum professor cadastrado.</td></tr>
          ) : (
            professores.filter(p => {
              const nomeOk = p.nome.toLowerCase().includes(busca.toLowerCase());
              const turmaNomes = getTurmasNomes(p).toLowerCase();
              const turmaOk = !buscaTurma || turmaNomes.split(', ').includes(buscaTurma.toLowerCase());
              return nomeOk && turmaOk;
            }).map((prof: any) => (
              <tr key={prof.id}>
                <td>{prof.nome}</td>
                <td>{getTurmasNomes(prof)}</td>
                <td>
                  <button className="btn-pill remover" type="button" onClick={() => handleDelete(prof.id)}>
                    remover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProfessorList;
