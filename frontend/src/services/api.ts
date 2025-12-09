import { Aluno, Turma, ApiResponse } from '../types';

const API_BASE_URL = '/';

/**
 * Serviço centralizado para consumo da API REST
 */

// ==================== ALUNOS ====================

export const alunoService = {
  /**
   * Buscar todos os alunos
   */
  getAll: async (): Promise<Aluno[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}alunos`);
      if (!response.ok) throw new Error('Erro ao buscar alunos');
      return await response.json();
    } catch (error) {
      console.error('Erro em alunoService.getAll:', error);
      throw error;
    }
  },

  /**
   * Buscar aluno por ID
   */
  getById: async (id: number): Promise<Aluno> => {
    try {
      const response = await fetch(`${API_BASE_URL}alunos/${id}`);
      if (!response.ok) throw new Error('Erro ao buscar aluno');
      return await response.json();
    } catch (error) {
      console.error('Erro em alunoService.getById:', error);
      throw error;
    }
  },

  /**
   * Criar novo aluno
   */
  create: async (aluno: Partial<Aluno>): Promise<Aluno> => {
    try {
      const response = await fetch(`${API_BASE_URL}alunos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno),
      });
      if (!response.ok) throw new Error('Erro ao criar aluno');
      return await response.json();
    } catch (error) {
      console.error('Erro em alunoService.create:', error);
      throw error;
    }
  },

  /**
   * Atualizar aluno existente
   */
  update: async (id: number, aluno: Partial<Aluno>): Promise<Aluno> => {
    try {
      const response = await fetch(`${API_BASE_URL}alunos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno),
      });
      if (!response.ok) throw new Error('Erro ao atualizar aluno');
      return await response.json();
    } catch (error) {
      console.error('Erro em alunoService.update:', error);
      throw error;
    }
  },

  /**
   * Deletar aluno
   */
  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}alunos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar aluno');
    } catch (error) {
      console.error('Erro em alunoService.delete:', error);
      throw error;
    }
  },
};

// ==================== TURMAS ====================

export const turmaService = {
  /**
   * Buscar todas as turmas
   */
  getAll: async (): Promise<Turma[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}turmas`);
      if (!response.ok) throw new Error('Erro ao buscar turmas');
      return await response.json();
    } catch (error) {
      console.error('Erro em turmaService.getAll:', error);
      throw error;
    }
  },

  /**
   * Buscar turma por ID
   */
  getById: async (id: number): Promise<Turma> => {
    try {
      const response = await fetch(`${API_BASE_URL}turmas/${id}`);
      if (!response.ok) throw new Error('Erro ao buscar turma');
      return await response.json();
    } catch (error) {
      console.error('Erro em turmaService.getById:', error);
      throw error;
    }
  },

  /**
   * Criar nova turma
   */
  create: async (turma: Partial<Turma>): Promise<Turma> => {
    try {
      const response = await fetch(`${API_BASE_URL}turmas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(turma),
      });
      if (!response.ok) throw new Error('Erro ao criar turma');
      return await response.json();
    } catch (error) {
      console.error('Erro em turmaService.create:', error);
      throw error;
    }
  },

  /**
   * Atualizar turma existente
   */
  update: async (id: number, turma: Partial<Turma>): Promise<Turma> => {
    try {
      const response = await fetch(`${API_BASE_URL}turmas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(turma),
      });
      if (!response.ok) throw new Error('Erro ao atualizar turma');
      return await response.json();
    } catch (error) {
      console.error('Erro em turmaService.update:', error);
      throw error;
    }
  },

  /**
   * Deletar turma
   */
  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}turmas/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar turma');
    } catch (error) {
      console.error('Erro em turmaService.delete:', error);
      throw error;
    }
  },
};
