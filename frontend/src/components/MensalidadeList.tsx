import React, { useEffect, useState } from 'react';
import './MensalidadeList.scss';

interface Mensalidade {
  id: number;
  aluno_nome: string;
  turma_nome: string;
  referencia_mes: string;
  valor: string;
  status: string;
  data_pagamento?: string;
  forma_pagamento?: string;
}

const MensalidadeList: React.FC = () => {
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [novo, setNovo] = useState({
    aluno_nome: '',
    turma_nome: '',
    referencia_mes: '',
    valor: '',
    status: 'Em Aberto',
    data_pagamento: '',
    forma_pagamento: ''
  });

  useEffect(() => {
    setLoading(true);
    fetch('/mensalidades')
      .then(res => res.json())
      .then(setMensalidades)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNovo({ ...novo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode fazer um POST para a API
    setMensalidades([
      ...mensalidades,
      { ...novo, id: Date.now() }
    ]);
    setShowForm(false);
    setNovo({
      aluno_nome: '', turma_nome: '', referencia_mes: '', valor: '', status: 'Em Aberto', data_pagamento: '', forma_pagamento: ''
    });
  };

  const handleRegistrarPagamento = (id: number) => {
    setMensalidades(mensalidades.map(m =>
      m.id === id
        ? { ...m, status: 'Pago', data_pagamento: new Date().toLocaleDateString('pt-BR'), forma_pagamento: 'PIX' }
        : m
    ));
  };

  const handleExcluir = (id: number) => {
    setMensalidades(mensalidades.filter(m => m.id !== id));
  };

  const handleEditar = (id: number) => {
    const m = mensalidades.find(m => m.id === id);
    if (m) {
      setNovo({
        aluno_nome: m.aluno_nome,
        turma_nome: m.turma_nome,
        referencia_mes: m.referencia_mes,
        valor: m.valor,
        status: m.status,
        data_pagamento: m.data_pagamento || '',
        forma_pagamento: m.forma_pagamento || ''
      });
      setShowForm(true);
      setMensalidades(mensalidades.filter(mens => mens.id !== id));
    }
  };

  return (
    <div className="mensalidade-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Lista de Mensalidades</h2>
        <button className="adicionar-mensalidade-btn" onClick={() => setShowForm(true)}>Adicionar Mensalidade</button>
      </div>
      {showForm && (
        <form className="form-mensalidade" onSubmit={handleSubmit} style={{marginBottom: '2rem'}}>
          <input name="aluno_nome" placeholder="Aluno" value={novo.aluno_nome} onChange={handleChange} required />
          <input name="turma_nome" placeholder="Turma" value={novo.turma_nome} onChange={handleChange} required />
          <input name="referencia_mes" placeholder="Mês/Ano" value={novo.referencia_mes} onChange={handleChange} required />
          <input name="valor" placeholder="Valor" value={novo.valor} onChange={handleChange} required />
          <select name="status" value={novo.status} onChange={handleChange}>
            <option value="Em Aberto">Em Aberto</option>
            <option value="Pago">Pago</option>
            <option value="Em Atraso">Em Atraso</option>
          </select>
          <input name="data_pagamento" placeholder="Data de Pagamento" value={novo.data_pagamento} onChange={handleChange} />
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
            {mensalidades.map(m => (
              <tr key={m.id}>
                <td>{m.aluno_nome}</td>
                <td>{m.turma_nome}</td>
                <td>{m.referencia_mes}</td>
                <td>R$ {m.valor}</td>
                <td style={{ color: m.status === 'Pago' ? 'green' : m.status === 'Em Atraso' ? 'red' : 'black' }}>{m.status}</td>
                <td>{m.data_pagamento || '–'}</td>
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
