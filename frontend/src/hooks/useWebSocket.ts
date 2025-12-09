import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { WebSocketMessage } from '../types';

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (event: string, data: any) => void;
  error: string | null;
}

/**
 * Custom hook para gerenciamento de conexão WebSocket com Socket.IO
 * 
 * @param url - URL do servidor WebSocket
 * @returns Objeto com estado da conexão, última mensagem recebida e função para enviar mensagens
 * 
 * @example
 * const { isConnected, lastMessage, sendMessage } = useWebSocket('http://localhost:3000');
 * 
 * // Enviar mensagem
 * sendMessage('ping', { data: 'test' });
 * 
 * // Reagir a mudanças
 * useEffect(() => {
 *   if (lastMessage) {
 *     console.log('Nova mensagem:', lastMessage);
 *   }
 * }, [lastMessage]);
 */
export const useWebSocket = (url: string = 'http://localhost:3000'): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Criar conexão Socket.IO
    const socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Event listeners
    socket.on('connect', () => {
      console.log('✅ WebSocket conectado:', socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket desconectado:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('🔴 Erro de conexão WebSocket:', err.message);
      setError(err.message);
      setIsConnected(false);
    });

    // Listener para mudanças de entidades
    socket.on('entityChange', (data: WebSocketMessage) => {
      console.log('📨 Mudança recebida via WebSocket:', data);
      setLastMessage(data);
    });

    // Listener para resposta de ping (teste)
    socket.on('pong', (data: any) => {
      console.log('🏓 Pong recebido:', data);
    });

    // Cleanup ao desmontar
    return () => {
      console.log('🔌 Desconectando WebSocket...');
      socket.disconnect();
    };
  }, [url]);

  // Função para enviar mensagens
  const sendMessage = useCallback((event: string, data: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
      console.log(`📤 Mensagem enviada [${event}]:`, data);
    } else {
      console.warn('⚠️ WebSocket não está conectado. Não foi possível enviar mensagem.');
    }
  }, [isConnected]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    error,
  };
};

export default useWebSocket;
