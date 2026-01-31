// Tipos para el juego Pasapalabra

export interface WordItem {
  letter: string;
  word: string;
  definition: string;
  status: 'pending' | 'correct' | 'wrong' | 'passed';
}

export interface TeamState {
  currentLetterIndex: number;
  correct: number;
  wrong: number;
  timeLeft: number;
  isTimerRunning: boolean;
  completed: boolean;
}

export interface GameState {
  isActive: boolean;
  rosco1: WordItem[];
  rosco2: WordItem[];
  currentTeam: 1 | 2;
  team1: TeamState;
  team2: TeamState;
  winner: 1 | 2 | null;
}

export interface RoscoInput {
  word: string;
  definition: string;
}

export type UserRole = 'admin' | 'player1' | 'player2' | 'spectator';

export interface PlayerGuess {
  team: 1 | 2;
  guess: string;
}

export interface GameEvents {
  connect: () => void;
  disconnect: () => void;
  gameState: (state: GameState) => void;
  roscoCreated: (data: { gameState: GameState }) => void;
  correctGuess: (data: { team: 1 | 2; letter: string; word: string; gameState: GameState }) => void;
  wrongGuess: (data: { team: 1 | 2; letter: string; correctWord: string; gameState: GameState }) => void;
  wordPassed: (data: { team: 1 | 2; letter: string; gameState: GameState }) => void;
  teamSwitched: (data: { currentTeam: 1 | 2 }) => void;
  timerUpdate: (data: { team: 1 | 2; timeLeft: number }) => void;
  gameEnded: (data: { winner: 1 | 2; gameState: GameState }) => void;
  gameReset: () => void;
  error: (data: { message: string }) => void;
}

export const LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'LL', 'M',
  'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
] as const;
