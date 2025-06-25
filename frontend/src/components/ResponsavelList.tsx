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

  // Sugestões de nomes de responsáveis para autocomplete
  const nomesResponsaveis = Array.from(new Set(responsaveis.map(r => r.nome)));

  // Carrega responsáveis do backend
  useEffect(() => {
    setLoading(true);
    fetch('/responsaveis')
      .then(res => res.json())
      .then(setResponsaveis)
      .finally(() => setLoading(false));
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
      console.log('Selecionados no select de alunos:', selected);
      setNovo({ ...novo, alunos: selected });
    } else {
      setNovo({ ...novo, [name]: value });
    }
  };

  // Salva novo responsável ou edita existente no backend
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Valor de novo.alunos no submit:', novo.alunos);
    // Garante que o campo alunos seja sempre um array de números
    const payload = { ...novo, alunos: Array.isArray(novo.alunos) ? novo.alunos.map(Number) : [] };
    console.log('Enviando para o backend (payload final):', payload);
    if (editId) {
      fetch(`/responsaveis/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: editId })
      })
        .then(response => {
          if (response.ok) {
            setShowForm(false);
            setEditId(null);
            setNovo({ id: 0, nome: '', cpf: '', telefone: '', email: '', parentesco: '', endereco: '', alunos: [], observacoes: '', pagador_principal: false, acesso_portal: false, doc_pendente: false });
            setLoading(true);
            fetch('/responsaveis').then(res => res.json()).then(setResponsaveis).finally(() => setLoading(false));
          } else {
            alert('Erro ao salvar responsável!');
          }
        })
        .catch(err => {
          console.error('Erro no fetch do handleSubmit:', err);
          alert('Erro inesperado ao salvar responsável!');
        });
    } else {
      fetch('/responsaveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(response => {
          if (response.ok) {
            setShowForm(false);
            setEditId(null);
            setNovo({ id: 0, nome: '', cpf: '', telefone: '', email: '', parentesco: '', endereco: '', alunos: [], observacoes: '', pagador_principal: false, acesso_portal: false, doc_pendente: false });
            setLoading(true);
            fetch('/responsaveis').then(res => res.json()).then(setResponsaveis).finally(() => setLoading(false));
          } else {
            alert('Erro ao salvar responsável!');
          }
        })
        .catch(err => {
          console.error('Erro no fetch do handleSubmit:', err);
          alert('Erro inesperado ao salvar responsável!');
        });
    }
  };

  // Editar responsável
  const handleEditar = (id: number) => {
    const r = responsaveis.find(r => r.id === id);
    if (r) {
      setNovo(r);
      setEditId(id);
      setShowForm(true);
    }
  };

  // Excluir responsável do backend
  const handleExcluir = async (id: number) => {
    await fetch(`/responsaveis/${id}`, { method: 'DELETE' });
    setLoading(true);
    fetch('/responsaveis').then(res => res.json()).then(setResponsaveis).finally(() => setLoading(false));
  };

  const handleWhatsapp = (telefone: string) => {
    const tel = telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${tel}`);
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}?subject=Comunicado Escolar`);
  };

  const responsaveisFiltrados = responsaveis.filter(r =>
    (!filtro.nome || (r.nome && r.nome.toLowerCase().includes(filtro.nome.toLowerCase()))) &&
    (!filtro.cpf || (r.cpf && r.cpf.includes(filtro.cpf))) &&
    (!filtro.aluno || (Array.isArray(r.alunos) && r.alunos.length > 0 && r.alunos.some(aid => {
      const aluno = alunos.find(a => a.id === aid);
      return aluno && aluno.nome && aluno.nome.toLowerCase().includes(filtro.aluno.toLowerCase());
    }))) &&
    (!filtro.parentesco || (r.parentesco && r.parentesco.toLowerCase().includes(filtro.parentesco.toLowerCase())))
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

  // Botão de teste para disparar fetch manualmente
  const testeFetch = () => {
    fetch('/responsaveis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'TesteBotao', cpf: '999' })
    })
      .then(r => r.json())
      .then(console.log)
      .catch(console.error);
  };

  console.log('ResponsavelList renderizado');
  console.log('Valor atual de novo.alunos:', novo.alunos);

  return (
    <div className="responsavel-list">
      {/* Remover botão de teste */}
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
        <input name="nome" placeholder="Filtrar por Nome" value={filtro.nome} onChange={e => setFiltro({ ...filtro, nome: e.target.value })} list="sugestoes-resp-busca" />
        <datalist id="sugestoes-resp-busca">
          {nomesResponsaveis.map(nome => (
            <option key={nome} value={nome} />
          ))}
        </datalist>
        <input name="cpf" placeholder="Filtrar por CPF" value={filtro.cpf} onChange={e => setFiltro({ ...filtro, cpf: e.target.value })} />
        <input name="aluno" placeholder="Filtrar por Aluno" value={filtro.aluno} onChange={e => setFiltro({ ...filtro, aluno: e.target.value })} />
        <input name="parentesco" placeholder="Filtrar por Parentesco" value={filtro.parentesco} onChange={e => setFiltro({ ...filtro, parentesco: e.target.value })} />
      </div>
      {showForm && (
        alunos.length === 0 ? (
          <div style={{color:'red',marginBottom:16}}>
            Cadastre pelo menos um aluno antes de adicionar um responsável.
          </div>
        ) : (
        <div className="form-responsavel" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
          <input name="nome" placeholder="Nome completo" value={novo.nome} onChange={handleChange} />
          <datalist id="sugestoes-resp-cadastro">
            {nomesResponsaveis.map(nome => (
              <option key={nome} value={nome} />
            ))}
          </datalist>
          <input name="cpf" placeholder="CPF" value={novo.cpf} onChange={handleChange} />
          <input name="telefone" placeholder="Telefone (WhatsApp)" value={novo.telefone} onChange={handleChange} />
          <input name="email" placeholder="E-mail" value={novo.email} onChange={handleChange} />
          <input name="parentesco" placeholder="Parentesco" value={novo.parentesco} onChange={handleChange} />
          <input name="endereco" placeholder="Endereço (opcional)" value={novo.endereco} onChange={handleChange} />
          <select name="alunos" multiple value={novo.alunos.map(String)} onChange={handleChange} style={{ minWidth: 180, minHeight: 60 }}>
            {alunos.map(a => (
              <option
                key={a.id}
                value={String(a.id)}
                style={{
                  background: novo.alunos.includes(a.id) ? '#d1e7dd' : undefined,
                  fontWeight: novo.alunos.includes(a.id) ? 'bold' : undefined
                }}
              >
                {a.nome} {novo.alunos.includes(a.id) ? '✓' : ''}
              </option>
            ))}
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
          <button type="button" onClick={handleSubmit}>Salvar</button>
          <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} style={{ background: '#ccc', color: '#222' }}>Cancelar</button>
        </div>
        )
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
