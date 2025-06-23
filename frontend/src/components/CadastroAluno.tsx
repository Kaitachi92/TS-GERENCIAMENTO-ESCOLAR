import React, { useEffect, useState } from 'react';
import './AlunoList.scss';

type Turma = { id: number; nome: string };

type Props = {
  turmas: Turma[];
  fetchAlunos: () => void;
  fetchResponsaveis: () => void;
};

const CadastroAluno: React.FC<Props> = ({ turmas, fetchAlunos, fetchResponsaveis }) => {
  const [form, setForm] = useState({
    nome: '',
    numero: '',
    email: '',
    cidade: '',
    bairro: '',
    cep: '',
    numero_responsavel: '',
    turma_id: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.turma_id) return;
    setLoading(true);
    await fetch('/alunos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        turma_id: Number(form.turma_id),
        numero: form.numero || undefined,
        email: form.email || undefined,
        cidade: form.cidade || undefined,
        bairro: form.bairro || undefined,
        cep: form.cep || undefined,
        numero_responsavel: form.numero_responsavel || undefined
      })
    });
    setForm({ nome: '', numero: '', email: '', cidade: '', bairro: '', cep: '', numero_responsavel: '', turma_id: '' });
    setLoading(false);
    fetchAlunos();
    fetchResponsaveis();
  };

  return (
    <div className="aluno-list">
      <h2>Cadastro de Alunos</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome do aluno" style={{ flex: 1 }} />
        <input name="numero" value={form.numero} onChange={handleChange} placeholder="Número" style={{ flex: 1 }} />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={{ flex: 1 }} />
        <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" style={{ flex: 1 }} />
        <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" style={{ flex: 1 }} />
        <input name="cep" value={form.cep} onChange={handleChange} placeholder="CEP" style={{ flex: 1 }} />
        <input name="numero_responsavel" value={form.numero_responsavel} onChange={handleChange} placeholder="Número do responsável" style={{ flex: 1 }} />
        <select name="turma_id" value={form.turma_id} onChange={handleChange} style={{ flex: 1 }}>
          <option value="">Selecione a turma</option>
          {turmas.map(turma => (
            <option key={turma.id} value={turma.id}>{turma.nome}</option>
          ))}
        </select>
        <button className="btn-pill" type="submit">adicionar</button>
      </form>
      {loading && <p>Carregando...</p>}
    </div>
  );
};

export default CadastroAluno;
