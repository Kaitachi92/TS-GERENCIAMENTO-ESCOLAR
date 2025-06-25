import React, { useEffect, useState } from 'react';
import './MensalidadeList.scss';

interface Mensalidade {
  id: number;
  aluno_id?: number;
  turma_id?: number;
  aluno_nome?: string;
  turma_nome?: string;
  referencia_mes: string;
  valor: string;
  status: string;
  data_pagamento?: string;
  forma_pagamento?: string;
  data_vencimento?: string;
}

const MensalidadeList: React.FC = () => {
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [alunos, setAlunos] = useState<{id:number, nome:string}[]>([]);
  const [turmas, setTurmas] = useState<{id:number, nome:string}[]>([]);
  const [novo, setNovo] = useState<Mensalidade>({
    id: 0,
    aluno_id: undefined,
    turma_id: undefined,
    referencia_mes: '',
    valor: '',
    status: 'Em Aberto',
    data_pagamento: '',
    forma_pagamento: '',
    data_vencimento: ''
  });
  const [busca, setBusca] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/mensalidades')
      .then(res => res.json())
      .then(setMensalidades)
      .finally(() => setLoading(false));
  }, []);

  // Buscar alunos e turmas ao abrir o formulário
  useEffect(() => {
    if (showForm) {
      fetch('/alunos').then(res => res.json()).then(setAlunos);
      fetch('/turmas').then(res => res.json()).then(setTurmas);
    }
  }, [showForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNovo({ ...novo, [e.target.name]: e.target.value });
  };

  // Função para formatar data DD/MM/YYYY para YYYY-MM-DD
  const formatarData = (data?: string) => {
    if (!data) return null;
    if (data.includes('/')) {
      const [dia, mes, ano] = data.split('/');
      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
    return data;
  };

  // Salvar nova mensalidade ou editar existente no backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novo.data_vencimento) {
      alert('Preencha a Data de Vencimento!');
      return;
    }
    const payload = {
      ...novo,
      aluno_id: Number(novo.aluno_id),
      turma_id: Number(novo.turma_id),
      data_pagamento: formatarData(novo.data_pagamento),
      data_vencimento: novo.data_vencimento
    };
    if (novo.id && mensalidades.some(m => m.id === novo.id)) {
      await fetch(`/mensalidades/${novo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch('/mensalidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: Date.now() })
      });
    }
    setShowForm(false);
    setNovo({ id: 0, aluno_id: undefined, turma_id: undefined, referencia_mes: '', valor: '', status: 'Em Aberto', data_pagamento: '', forma_pagamento: '', data_vencimento: '' });
    setLoading(true);
    fetch('/mensalidades').then(res => res.json()).then(setMensalidades).finally(() => setLoading(false));
  };

  // Editar mensalidade
  const handleEditar = (id: number) => {
    const m = mensalidades.find(m => m.id === id);
    if (m) {
      // Converter data_pagamento para YYYY-MM-DD se vier como DD/MM/YYYY
      let data_pagamento = m.data_pagamento || '';
      if (data_pagamento && data_pagamento.includes('/')) {
        const [dia, mes, ano] = data_pagamento.split('/');
        data_pagamento = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      }
      setNovo({
        id: m.id,
        aluno_id: m.aluno_id,
        turma_id: m.turma_id,
        referencia_mes: m.referencia_mes,
        valor: m.valor,
        status: m.status,
        data_pagamento,
        forma_pagamento: m.forma_pagamento || '',
        data_vencimento: m.data_vencimento || ''
      });
      setShowForm(true);
    }
  };

  // Excluir mensalidade do backend
  const handleExcluir = async (id: number) => {
    await fetch(`/mensalidades/${id}`, { method: 'DELETE' });
    setLoading(true);
    fetch('/mensalidades').then(res => res.json()).then(setMensalidades).finally(() => setLoading(false));
  };

  // Registrar pagamento de uma mensalidade
  const handleRegistrarPagamento = async (id: number) => {
    const m = mensalidades.find(m => m.id === id);
    if (m) {
      // Converte data para YYYY-MM-DD
      const hoje = new Date();
      const dataPag = hoje.toISOString().slice(0, 10); // YYYY-MM-DD
      const atualizado = {
        ...m,
        status: 'Pago',
        data_pagamento: dataPag,
        forma_pagamento: 'PIX'
      };
      await fetch(`/mensalidades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(atualizado)
      });
      setLoading(true);
      fetch('/mensalidades').then(res => res.json()).then(setMensalidades).finally(() => setLoading(false));
    }
  };

  function formatarDataBR(data?: string) {
    if (!data) return '';
    // Trata datas no formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
    if (data.includes('T')) {
      const [dataParte] = data.split('T');
      const [ano, mes, dia] = dataParte.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    // Trata datas no formato YYYY-MM-DD
    if (data.includes('-')) {
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    return data;
  }

  // Filtra mensalidades conforme busca
  const mensalidadesFiltradas = mensalidades.filter(m => {
    const buscaLower = busca.toLowerCase();
    return (
      (m.aluno_nome && m.aluno_nome.toLowerCase().includes(buscaLower)) ||
      (m.turma_nome && m.turma_nome.toLowerCase().includes(buscaLower)) ||
      (m.referencia_mes && m.referencia_mes.toLowerCase().includes(buscaLower))
    );
  });

  return (
    <div className="mensalidade-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Lista de Mensalidades</h2>
        <button className="adicionar-mensalidade-btn" onClick={() => setShowForm(true)}>Adicionar Mensalidade</button>
      </div>
      <input
        type="text"
        placeholder="Buscar por aluno, turma ou mês/ano..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
        style={{ margin: '1rem 0', width: '100%', padding: '0.5rem' }}
      />
      {showForm && (
        <form className="form-mensalidade" onSubmit={handleSubmit} style={{marginBottom: '2rem'}}>
          <select name="aluno_id" value={novo.aluno_id || ''} onChange={handleChange} required>
            <option value="">Selecione o aluno</option>
            {alunos.map(aluno => (
              <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
            ))}
          </select>
          <select name="turma_id" value={novo.turma_id || ''} onChange={handleChange} required>
            <option value="">Selecione a turma</option>
            {turmas.map(turma => (
              <option key={turma.id} value={turma.id}>{turma.nome}</option>
            ))}
          </select>
          {/* Seletor de mês/ano para referencia_mes */}
          <input
            name="referencia_mes"
            placeholder="Mês/Ano"
            value={novo.referencia_mes}
            onChange={e => {
              // Aceita apenas MM/YYYY
              setNovo(n => ({ ...n, referencia_mes: e.target.value }));
            }}
            required
            type="month"
            onInput={e => {
              // Converte YYYY-MM para MM/YYYY
              const value = (e.target as HTMLInputElement).value;
              if (value) {
                const [ano, mes] = value.split('-');
                setNovo(n => ({ ...n, referencia_mes: `${mes}/${ano}` }));
              }
            }}
          />
          <input
            name="valor"
            placeholder="Valor"
            value={novo.valor}
            onChange={e => {
              // Permite apenas números e ponto
              const value = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
              setNovo(n => ({ ...n, valor: value }));
            }}
            required
            type="number"
            step="0.01"
            min="0"
          />
          <select name="status" value={novo.status} onChange={handleChange}>
            <option value="Em Aberto">Em Aberto</option>
            <option value="Pago">Pago</option>
            <option value="Em Atraso">Em Atraso</option>
          </select>
          {/* Data de Pagamento só aparece se estiver editando uma mensalidade existente */}
          {novo.id ? (
            <input
              name="data_pagamento"
              placeholder="Data de Pagamento"
              value={novo.data_pagamento}
              onChange={e => {
                setNovo(n => ({ ...n, data_pagamento: e.target.value }));
              }}
              type="date"
            />
          ) : null}
          <input
            name="data_vencimento"
            placeholder="Data de Vencimento"
            value={novo.data_vencimento}
            onChange={e => {
              setNovo(n => ({ ...n, data_vencimento: e.target.value }));
            }}
            type="date"
            required
          />
          <input name="forma_pagamento" placeholder="Forma de Pagamento" value={novo.forma_pagamento} onChange={handleChange} />
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => setShowForm(false)} style={{background:'#ccc',color:'#222'}}>Cancelar</button>
        </form>
      )}
      {loading ? <p>Carregando...</p> : (
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Turma</th>
              <th>Mês/Ano</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data de Pagamento</th>
              <th>Forma de Pagamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {mensalidadesFiltradas.map(m => (
              <tr key={m.id}>
                <td>{m.aluno_nome}</td>
                <td>{m.turma_nome}</td>
                <td>{m.referencia_mes}</td>
                <td>R$ {m.valor}</td>
                <td style={{ color: m.status === 'Pago' ? 'green' : m.status === 'Em Atraso' ? 'red' : 'black' }}>{m.status}</td>
                <td>{m.data_pagamento ? formatarDataBR(m.data_pagamento) : '–'}</td>
                <td>{m.forma_pagamento || '–'}</td>
                <td>
                  {m.status === 'Pago' ? (
                    <>
                      <button className="btn-editar" onClick={() => handleEditar(m.id)}>Editar</button>
                      <button className="btn-excluir" onClick={() => handleExcluir(m.id)}>Excluir</button>
                    </>
                  ) : (
                    <button onClick={() => handleRegistrarPagamento(m.id)}>Registrar Pagamento</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MensalidadeList;
