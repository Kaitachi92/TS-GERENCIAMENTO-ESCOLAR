import React, { useEffect, useState } from 'react';
import './DisciplinaList.scss';

interface Disciplina {
  id: number;
  nome: string;
  turma: string;
  professor: string;
  carga_horaria: string;
  turno: string;
  observacoes?: string;
  ano_letivo?: string;
  area_conhecimento?: string;
  optativa?: boolean;
}

interface Professor {
  id: number;
  nome: string;
}

const DisciplinaList: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [filtro, setFiltro] = useState({ professor: '', turma: '', turno: '' });
  const [nova, setNova] = useState<Disciplina>({
    id: 0,
    nome: '',
    turma: '',
    professor: '',
    carga_horaria: '',
    turno: '',
    observacoes: '',
    ano_letivo: '',
    area_conhecimento: '',
    optativa: false
  });

  useEffect(() => {
    setLoading(true);
    fetch('/disciplinas').then(res => res.json()).then(setDisciplinas).finally(() => setLoading(false));
    fetch('/professores').then(res => res.json()).then(setProfessores);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setNova({ ...nova, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setNova({ ...nova, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setDisciplinas(disciplinas.map(d => d.id === editId ? { ...nova, id: editId } : d));
    } else {
      setDisciplinas([...disciplinas, { ...nova, id: Date.now() }]);
    }
    setShowForm(false);
    setEditId(null);
    setNova({ id: 0, nome: '', turma: '', professor: '', carga_horaria: '', turno: '', observacoes: '', ano_letivo: '', area_conhecimento: '', optativa: false });
  };

  const handleEditar = (id: number) => {
    const d = disciplinas.find(d => d.id === id);
    if (d) {
      setNova(d);
      setEditId(id);
      setShowForm(true);
    }
  };

  const handleExcluir = (id: number) => {
    setDisciplinas(disciplinas.filter(d => d.id !== id));
  };

  const disciplinasFiltradas = disciplinas.filter(d =>
    (!filtro.professor || d.professor === filtro.professor) &&
    (!filtro.turma || d.turma === filtro.turma) &&
    (!filtro.turno || d.turno === filtro.turno)
  );

  return (
    <div className="disciplina-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Lista de Disciplinas</h2>
        <button className="adicionar-disciplina-btn" onClick={() => { setShowForm(true); setEditId(null); }}>Adicionar Disciplina</button>
      </div>
      <div className="filtros-disciplina" style={{ margin: '1rem 0', display: 'flex', gap: '1rem' }}>
        <select name="professor" value={filtro.professor} onChange={e => setFiltro({ ...filtro, professor: e.target.value })}>
          <option value="">Todos Professores</option>
          {professores.map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}
        </select>
        <input name="turma" placeholder="Filtrar por Turma" value={filtro.turma} onChange={e => setFiltro({ ...filtro, turma: e.target.value })} />
        <select name="turno" value={filtro.turno} onChange={e => setFiltro({ ...filtro, turno: e.target.value })}>
          <option value="">Todos Turnos</option>
          <option value="Manhã">Manhã</option>
          <option value="Tarde">Tarde</option>
          <option value="Noite">Noite</option>
        </select>
      </div>
      {showForm && (
        <form className="form-disciplina" onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
          <input name="nome" placeholder="Nome da Disciplina" value={nova.nome} onChange={handleChange} required />
          <input name="turma" placeholder="Turma/Série" value={nova.turma} onChange={handleChange} required />
          <select name="professor" value={nova.professor} onChange={handleChange} required>
            <option value="">Selecione o Professor</option>
            {professores.map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}
          </select>
          <input name="carga_horaria" placeholder="Carga Horária (ex: 4h/semana)" value={nova.carga_horaria} onChange={handleChange} required />
          <select name="turno" value={nova.turno} onChange={handleChange} required>
            <option value="">Selecione o Turno</option>
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
            <option value="Noite">Noite</option>
          </select>
          <input name="ano_letivo" placeholder="Ano Letivo" value={nova.ano_letivo} onChange={handleChange} />
          <input name="area_conhecimento" placeholder="Área do Conhecimento" value={nova.area_conhecimento} onChange={handleChange} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <input type="checkbox" name="optativa" checked={nova.optativa} onChange={handleChange} /> Optativa
          </label>
          <input name="observacoes" placeholder="Observações" value={nova.observacoes} onChange={handleChange} />
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} style={{ background: '#ccc', color: '#222' }}>Cancelar</button>
        </form>
      )}
      {loading ? <p>Carregando...</p> : (
        <table>
          <thead>
            <tr>
              <th>Nome da Disciplina</th>
              <th>Série / Turma</th>
              <th>Professor Responsável</th>
              <th>Carga Horária</th>
              <th>Turno</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {disciplinasFiltradas.map(d => (
              <tr key={d.id}>
                <td>{d.nome}</td>
                <td>{d.turma}</td>
                <td>{d.professor}</td>
                <td>{d.carga_horaria}</td>
                <td>{d.turno}</td>
                <td>
                  <button className="btn-editar" onClick={() => handleEditar(d.id)}>Editar</button>
                  <button className="btn-excluir" onClick={() => handleExcluir(d.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DisciplinaList;
