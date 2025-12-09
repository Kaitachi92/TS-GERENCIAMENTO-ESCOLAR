/**
 * Tipos centralizados do sistema de gerenciamento escolar
 */

export interface Aluno {
  id: number;
  nome: string;
  data_nascimento?: string;
  turma_id?: number;
  responsavel_id?: number;
  endereco?: string;
  telefone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Turma {
  id: number;
  nome: string;
  ano_letivo?: number;
  turno?: string;
  nivel_ensino?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Professor {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  especialidade?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Responsavel {
  id: number;
  nome: string;
  parentesco: string;
  telefone: string;
  email: string;
  endereco: string;
  created_at?: string;
  updated_at?: string;
}

export interface Disciplina {
  id: number;
  nome: string;
  carga_horaria?: number;
  descricao?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Mensalidade {
  id: number;
  aluno_id: number;
  turma_id?: number;
  valor: number;
  mes_referencia: string;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'pendente' | 'pago' | 'atrasado';
  forma_pagamento?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WebSocketMessage {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'aluno' | 'turma' | 'professor' | 'responsavel' | 'disciplina' | 'mensalidade';
  data: any;
  timestamp: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
