import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { GameState } from '@/types/game';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Conectado al servidor');
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Error de conexión:', err);
      setError('Error de conexión con el servidor');
    });

    socket.on('gameState', (state: GameState) => {
      setGameState(state);
    });

    socket.on('roscoCreated', (data: { gameState: GameState }) => {
      setGameState(data.gameState);
    });

    socket.on('correctGuess', (data: { gameState: GameState }) => {
      setGameState(data.gameState);
    });

    socket.on('wrongGuess', (data: { gameState: GameState }) => {
      setGameState(data.gameState);
    });

    socket.on('wordPassed', (data: { gameState: GameState }) => {
      setGameState(data.gameState);
    });

    socket.on('teamSwitched', (data: { currentTeam: 1 | 2 }) => {
      setGameState(prev => prev ? { ...prev, currentTeam: data.currentTeam } : null);
    });

    socket.on('timerUpdate', (data: { team: 1 | 2; timeLeft: number }) => {
      setGameState(prev => {
        if (!prev) return null;
        const teamKey = data.team === 1 ? 'team1' : 'team2';
        return {
          ...prev,
          [teamKey]: {
            ...prev[teamKey],
            timeLeft: data.timeLeft
          }
        };
      });
    });

    socket.on('gameEnded', (data: { winner: 1 | 2; gameState: GameState }) => {
      setGameState(data.gameState);
    });

    socket.on('gameReset', () => {
      setGameState(null);
    });

    socket.on('error', (data: { message: string }) => {
      setError(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRosco = useCallback((rosco1: { word: string; definition: string }[], rosco2: { word: string; definition: string }[]) => {
    socketRef.current?.emit('createRosco', { rosco1, rosco2 });
  }, []);

  const guessWord = useCallback((team: 1 | 2, guess: string) => {
    socketRef.current?.emit('guessWord', { team, guess });
  }, []);

  const passWord = useCallback((team: 1 | 2) => {
    socketRef.current?.emit('passWord', { team });
  }, []);

  const resetGame = useCallback(() => {
    socketRef.current?.emit('resetGame');
  }, []);

  const nextLetter = useCallback((team: 1 | 2) => {
    socketRef.current?.emit('nextLetter', { team });
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    gameState,
    error,
    createRosco,
    guessWord,
    passWord,
    resetGame,
    nextLetter
  };
}
