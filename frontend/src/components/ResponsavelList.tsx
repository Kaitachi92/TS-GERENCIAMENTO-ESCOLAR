import React, { useEffect, useState } from 'react';
import './ResponsavelList.scss';

interface Responsavel {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  parentesco: string;
  endereco?: string;
  alunos: number[];
  observacoes?: string;
  pagador_principal?: boolean;
  acesso_portal?: boolean;
  doc_pendente?: boolean;
}

interface Aluno {
  id: number;
  nome: string;
}

const ResponsavelList: React.FC = () => {
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [filtro, setFiltro] = useState({ nome: '', cpf: '', aluno: '', parentesco: '' });
  const [novo, setNovo] = useState<Responsavel>({
    id: 0,
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    parentesco: '',
    endereco: '',
    alunos: [],
    observacoes: '',
    pagador_principal: false,
    acesso_portal: false,
    doc_pendente: false
  });

  useEffect(() => {
    setLoading(true);
    fetch('/responsaveis').then(res => res.json()).then(setResponsaveis).finally(() => setLoading(false));
    fetch('/alunos').then(res => res.json()).then(setAlunos);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setNovo({ ...novo, [name]: (e.target as HTMLInputElement).checked });
    } else if (name === 'alunos') {
      const options = (e.target as HTMLSelectElement).options;
      const selected: number[] = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) selected.push(Number(options[i].value));
      }
      setNovo({ ...novo, alunos: selected });
    } else {
      setNovo({ ...novo, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setResponsaveis(responsaveis.map(r => r.id === editId ? { ...novo, id: editId } : r));
    } else {
      setResponsaveis([...responsaveis, { ...novo, id: Date.now() }]);
    }
    setShowForm(false);
    setEditId(null);
    setNovo({ id: 0, nome: '', cpf: '', telefone: '', email: '', parentesco: '', endereco: '', alunos: [], observacoes: '', pagador_principal: false, acesso_portal: false, doc_pendente: false });
  };

  const handleEditar = (id: number) => {
    const r = responsaveis.find(r => r.id === id);
    if (r) {
      setNovo(r);
      setEditId(id);
      setShowForm(true);
    }
  };

  const handleExcluir = (id: number) => {
    setResponsaveis(responsaveis.filter(r => r.id !== id));
  };

  const handleWhatsapp = (telefone: string) => {
    const tel = telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${tel}`);
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}?subject=Comunicado Escolar`);
  };

  const responsaveisFiltrados = responsaveis.filter(r =>
    (!filtro.nome || r.nome.toLowerCase().includes(filtro.nome.toLowerCase())) &&
    (!filtro.cpf || r.cpf.includes(filtro.cpf)) &&
    (!filtro.aluno || r.alunos.some(aid => alunos.find(a => a.id === aid)?.nome.toLowerCase().includes(filtro.aluno.toLowerCase()))) &&
    (!filtro.parentesco || r.parentesco.toLowerCase().includes(filtro.parentesco.toLowerCase()))
  );

  const handleImportarCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const linhas = text.split(/\r?\n/).filter(Boolean);
      const novos = linhas.slice(1).map(linha => {
        const [nome, cpf, telefone, email, parentesco, endereco, alunos, observacoes] = linha.split(',');
        return {
          id: Date.now() + Math.random(),
          nome,
          cpf,
          telefone,
          email,
          parentesco,
          endereco,
          alunos: alunos ? alunos.split(';').map(Number) : [],
          observacoes,
          pagador_principal: false,
          acesso_portal: false,
          doc_pendente: false
        };
      });
      setResponsaveis(prev => [...prev, ...novos]);
    };
    reader.readAsText(file);
  };

  return (
    <div className="responsavel-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Lista de Responsáveis</h2>
        <div>
          <button className="adicionar-responsavel-btn" onClick={() => { setShowForm(true); setEditId(null); }}>Adicionar Responsável</button>
          <label className="importar-csv-label" style={{ marginLeft: 12 }}>
            <input type="file" accept=".csv" onChange={handleImportarCSV} style={{ display: 'none' }} />
            <span className="importar-csv-btn">Importar CSV</span>
          </label>
        </div>
      </div>
      <div className="filtros-responsavel" style={{ margin: '1rem 0', display: 'flex', gap: '1rem' }}>
        <input name="nome" placeholder="Filtrar por Nome" value={filtro.nome} onChange={e => setFiltro({ ...filtro, nome: e.target.value })} />
        <input name="cpf" placeholder="Filtrar por CPF" value={filtro.cpf} onChange={e => setFiltro({ ...filtro, cpf: e.target.value })} />
        <input name="aluno" placeholder="Filtrar por Aluno" value={filtro.aluno} onChange={e => setFiltro({ ...filtro, aluno: e.target.value })} />
        <input name="parentesco" placeholder="Filtrar por Parentesco" value={filtro.parentesco} onChange={e => setFiltro({ ...filtro, parentesco: e.target.value })} />
      </div>
      {showForm && (
        <form className="form-responsavel" onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
          <input name="nome" placeholder="Nome completo" value={novo.nome} onChange={handleChange} required />
          <input name="cpf" placeholder="CPF" value={novo.cpf} onChange={handleChange} required pattern="\d{3}\.\d{3}\.\d{3}-\d{2}" />
          <input name="telefone" placeholder="Telefone (WhatsApp)" value={novo.telefone} onChange={handleChange} required />
          <input name="email" placeholder="E-mail" value={novo.email} onChange={handleChange} required />
          <input name="parentesco" placeholder="Parentesco" value={novo.parentesco} onChange={handleChange} required />
          <input name="endereco" placeholder="Endereço (opcional)" value={novo.endereco} onChange={handleChange} />
          <select name="alunos" multiple value={novo.alunos.map(String)} onChange={handleChange} style={{ minWidth: 180, minHeight: 60 }}>
            {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
          </select>
          <input name="observacoes" placeholder="Observações" value={novo.observacoes} onChange={handleChange} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <input type="checkbox" name="pagador_principal" checked={!!novo.pagador_principal} onChange={handleChange} /> Pagador Principal
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <input type="checkbox" name="acesso_portal" checked={!!novo.acesso_portal} onChange={handleChange} /> Acesso ao Portal
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <input type="checkbox" name="doc_pendente" checked={!!novo.doc_pendente} onChange={handleChange} /> Documentação Pendente
          </label>
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} style={{ background: '#ccc', color: '#222' }}>Cancelar</button>
        </form>
      )}
      {loading ? <p>Carregando...</p> : (
        <table>
          <thead>
            <tr>
              <th>Nome do Responsável</th>
              <th>CPF</th>
              <th>Aluno(s) Vinculado(s)</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Parentesco</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {responsaveisFiltrados.map(r => (
              <tr key={r.id}>
                <td>{r.nome}</td>
                <td>{r.cpf}</td>
                <td>{r.alunos.map(aid => alunos.find(a => a.id === aid)?.nome).filter(Boolean).join(', ')}</td>
                <td>{r.telefone}</td>
                <td>{r.email}</td>
                <td>{r.parentesco}</td>
                <td>
                  <button className="btn-editar" onClick={() => handleEditar(r.id)}>Editar</button>
                  <button className="btn-excluir" onClick={() => handleExcluir(r.id)}>Excluir</button>
                  <button className="btn-whatsapp" title="Enviar WhatsApp" onClick={() => handleWhatsapp(r.telefone)}>WhatsApp</button>
                  <button className="btn-email" title="Enviar E-mail" onClick={() => handleEmail(r.email)}>E-mail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResponsavelList;
