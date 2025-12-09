import React, { useState, useEffect } from 'react';
import { Aluno, Turma } from '../types';
import { alunoService, turmaService } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import './AlunoView.scss';

/**
 * View completa de CRUD para Alunos
 * Implementa Create, Read, Update e Delete com integração WebSocket
 */
const AlunoView: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para formulário de criação/edição
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Aluno>>({
    nome: '',
    data_nascimento: '',
    turma_id: undefined,
    endereco: '',
    telefone_contato: '',
  });

  // WebSocket hook
  const { isConnected, lastMessage } = useWebSocket('http://localhost:3000');

  // Carregar alunos e turmas ao montar
  useEffect(() => {
    loadAlunos();
    loadTurmas();
  }, []);

  // Reagir a mudanças via WebSocket
  useEffect(() => {
    if (lastMessage && lastMessage.entity === 'aluno') {
      console.log('Mudança em aluno detectada via WebSocket:', lastMessage);
      loadAlunos(); // Recarregar lista
    }
  }, [lastMessage]);

  const loadAlunos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alunoService.getAll();
      setAlunos(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  const loadTurmas = async () => {
    try {
      const data = await turmaService.getAll();
      setTurmas(data);
    } catch (err) {
      console.error('Erro ao carregar turmas:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome?.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (formMode === 'create') {
        await alunoService.create(formData);
      } else if (editingId !== null) {
        await alunoService.update(editingId, formData);
      }
      
      // Resetar formulário
      setFormData({
        nome: '',
        data_nascimento: '',
        turma_id: undefined,
        endereco: '',
        telefone_contato: '',
      });
      setFormMode('create');
      setEditingId(null);
      
      // Recarregar lista
      await loadAlunos();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar aluno');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setFormMode('edit');
    setEditingId(aluno.id);
    setFormData({
      nome: aluno.nome,
      data_nascimento: aluno.data_nascimento || '',
      turma_id: aluno.turma_id,
      endereco: aluno.endereco || '',
      telefone_contato: aluno.telefone_contato || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este aluno?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await alunoService.delete(id);
      await loadAlunos();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar aluno');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormMode('create');
    setEditingId(null);
    setFormData({
      nome: '',
      data_nascimento: '',
      turma_id: undefined,
      endereco: '',
      telefone_contato: '',
    });
  };

  // Filtrar alunos pela busca
  const filteredAlunos = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="aluno-view">
      <div className="view-header">
        <h1>👨‍🎓 Gerenciamento de Alunos</h1>
        <div className="websocket-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 WebSocket Conectado' : '🔴 WebSocket Desconectado'}
          </span>
        </div>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      {/* Formulário de Criação/Edição */}
      <div className="form-section">
        <h2>{formMode === 'create' ? '➕ Cadastrar Novo Aluno' : '✏️ Editar Aluno'}</h2>
        <form onSubmit={handleSubmit} className="aluno-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome *</label>
              <input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo do aluno"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="data_nascimento">Data de Nascimento</label>
              <input
                id="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="turma_id">Turma</label>
              <select
                id="turma_id"
                value={formData.turma_id || ''}
                onChange={(e) => setFormData({ ...formData, turma_id: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">Selecione uma turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="telefone_contato">Telefone</label>
              <input
                id="telefone_contato"
                type="tel"
                value={formData.telefone_contato}
                onChange={(e) => setFormData({ ...formData, telefone_contato: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereço</label>
            <input
              id="endereco"
              type="text"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              placeholder="Endereço completo"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Salvando...' : formMode === 'create' ? '➕ Cadastrar' : '💾 Salvar'}
            </button>
            {formMode === 'edit' && (
              <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Alunos */}
      <div className="list-section">
        <div className="list-header">
          <h2>📋 Lista de Alunos ({filteredAlunos.length})</h2>
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <div className="loading">⏳ Carregando...</div>}

        {!loading && filteredAlunos.length === 0 && (
          <div className="no-data">Nenhum aluno encontrado</div>
        )}

        {!loading && filteredAlunos.length > 0 && (
          <div className="table-container">
            <table className="aluno-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Data Nascimento</th>
                  <th>Turma</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlunos.map((aluno) => {
                  const turma = turmas.find(t => t.id === aluno.turma_id);
                  return (
                    <tr key={aluno.id}>
                      <td>#{aluno.id}</td>
                      <td><strong>{aluno.nome}</strong></td>
                      <td>
                        {aluno.data_nascimento 
                          ? new Date(aluno.data_nascimento).toLocaleDateString('pt-BR')
                          : 'N/A'}
                      </td>
                      <td>{turma ? turma.nome : 'Sem turma'}</td>
                      <td>{aluno.telefone_contato || 'N/A'}</td>
                      <td className="actions">
                        <button
                          onClick={() => handleEdit(aluno)}
                          className="btn-icon btn-edit"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(aluno.id)}
                          className="btn-icon btn-delete"
                          title="Deletar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlunoView;
