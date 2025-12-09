import React, { useState, useEffect } from 'react';
import { Turma } from '../types';
import { turmaService } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import './TurmaView.scss';

/**
 * View completa de CRUD para Turmas
 * Implementa Create, Read, Update e Delete com integração WebSocket
 */
const TurmaView: React.FC = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para formulário de criação/edição
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Turma>>({
    nome: '',
    ano_letivo: undefined,
    turno: '',
    nivel_ensino: '',
  });

  // WebSocket hook
  const { isConnected, lastMessage } = useWebSocket('http://localhost:3000');

  // Carregar turmas ao montar
  useEffect(() => {
    loadTurmas();
  }, []);

  // Reagir a mudanças via WebSocket
  useEffect(() => {
    if (lastMessage && lastMessage.entity === 'turma') {
      console.log('Mudança em turma detectada via WebSocket:', lastMessage);
      loadTurmas(); // Recarregar lista
    }
  }, [lastMessage]);

  const loadTurmas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await turmaService.getAll();
      setTurmas(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar turmas');
    } finally {
      setLoading(false);
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
        await turmaService.create(formData);
      } else if (editingId !== null) {
        await turmaService.update(editingId, formData);
      }
      
      // Resetar formulário
      setFormData({
        nome: '',
        ano_letivo: undefined,
        turno: '',
        nivel_ensino: '',
      });
      setFormMode('create');
      setEditingId(null);
      
      // Recarregar lista
      await loadTurmas();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar turma');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (turma: Turma) => {
    setFormMode('edit');
    setEditingId(turma.id);
    setFormData({
      nome: turma.nome,
      ano_letivo: turma.ano_letivo,
      turno: turma.turno || '',
      nivel_ensino: turma.nivel_ensino || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta turma?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await turmaService.delete(id);
      await loadTurmas();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar turma');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormMode('create');
    setEditingId(null);
    setFormData({
      nome: '',
      ano_letivo: undefined,
      turno: '',
      nivel_ensino: '',
    });
  };

  // Filtrar turmas pela busca
  const filteredTurmas = turmas.filter(turma =>
    turma.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="turma-view">
      <div className="view-header">
        <h1>🏫 Gerenciamento de Turmas</h1>
        <div className="websocket-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 WebSocket Conectado' : '🔴 WebSocket Desconectado'}
          </span>
        </div>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      {/* Formulário de Criação/Edição */}
      <div className="form-section">
        <h2>{formMode === 'create' ? '➕ Cadastrar Nova Turma' : '✏️ Editar Turma'}</h2>
        <form onSubmit={handleSubmit} className="turma-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome da Turma *</label>
              <input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: 1º Ano A"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="ano_letivo">Ano Letivo</label>
              <input
                id="ano_letivo"
                type="number"
                value={formData.ano_letivo || ''}
                onChange={(e) => setFormData({ ...formData, ano_letivo: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Ex: 2025"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="turno">Turno</label>
              <select
                id="turno"
                value={formData.turno || ''}
                onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
              >
                <option value="">Selecione um turno</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
                <option value="Integral">Integral</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="nivel_ensino">Nível de Ensino</label>
              <input
                id="nivel_ensino"
                type="text"
                value={formData.nivel_ensino}
                onChange={(e) => setFormData({ ...formData, nivel_ensino: e.target.value })}
                placeholder="Ex: Fundamental, Infantil"
              />
            </div>
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

      {/* Lista de Turmas */}
      <div className="list-section">
        <div className="list-header">
          <h2>📋 Lista de Turmas ({filteredTurmas.length})</h2>
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <div className="loading">⏳ Carregando...</div>}

        {!loading && filteredTurmas.length === 0 && (
          <div className="no-data">Nenhuma turma encontrada</div>
        )}

        {!loading && filteredTurmas.length > 0 && (
          <div className="table-container">
            <table className="turma-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Ano Letivo</th>
                  <th>Turno</th>
                  <th>Nível Ensino</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTurmas.map((turma) => (
                  <tr key={turma.id}>
                    <td>#{turma.id}</td>
                    <td><strong>{turma.nome}</strong></td>
                    <td>{turma.ano_letivo || 'N/A'}</td>
                    <td>
                      {turma.turno && (
                        <span className={`badge badge-${turma.turno.toLowerCase()}`}>
                          {turma.turno}
                        </span>
                      )}
                      {!turma.turno && 'N/A'}
                    </td>
                    <td>{turma.nivel_ensino || 'N/A'}</td>
                    <td className="actions">
                      <button
                        onClick={() => handleEdit(turma)}
                        className="btn-icon btn-edit"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(turma.id)}
                        className="btn-icon btn-delete"
                        title="Deletar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TurmaView;
