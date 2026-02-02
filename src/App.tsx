import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { RoleSelector } from '@/components/RoleSelector';
import { Rosco } from '@/components/Rosco';
import { Timer } from '@/components/Timer';
import { ScoreBoard } from '@/components/ScoreBoard';
import { DefinitionCard } from '@/components/DefinitionCard';
import { PlayerControls } from '@/components/PlayerControls';
import { AdminPanel } from '@/components/AdminPanel';
import { GameWinner } from '@/components/GameWinner';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import type { UserRole } from '@/types/game';
import { cn } from '@/lib/utils';
import { Volume2, VolumeX, Users, Clock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const {
    isConnected,
    gameState,
    createRosco,
    guessWord,
    passWord,
    resetGame
  } = useSocket();

  // Efectos de sonido
  const playSound = (type: 'correct' | 'wrong' | 'pass' | 'win') => {
    if (!soundEnabled) return;

    const sounds = {
      correct: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
      wrong: 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.mp3',
      pass: 'https://www.soundjay.com/misc/sounds/whoosh.mp3',
      win: 'https://www.soundjay.com/misc/sounds/success-fanfare-trumpets-01.mp3'
    };

    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;
    audio.play().catch(() => { });
  };

  // Escuchar eventos de sonido
  useEffect(() => {
    if (!gameState) return;

    // Detectar cambios para reproducir sonidos
    const lastWord1 = gameState.rosco1[gameState.team1.currentLetterIndex - 1];
    const lastWord2 = gameState.rosco2[gameState.team2.currentLetterIndex - 1];

    if (lastWord1?.status === 'correct' || lastWord2?.status === 'correct') {
      playSound('correct');
    } else if (lastWord1?.status === 'wrong' || lastWord2?.status === 'wrong') {
      playSound('wrong');
    } else if (lastWord1?.status === 'passed' || lastWord2?.status === 'passed') {
      playSound('pass');
    }

    if (gameState.winner) {
      playSound('win');
    }
  }, [gameState]);

  const handleGuess = (team: 1 | 2, guess: string) => {
    guessWord(team, guess);
  };

  const handlePass = (team: 1 | 2) => {
    passWord(team);
  };

  const getCurrentWord = (team: 1 | 2) => {
    if (!gameState) return null;
    const rosco = team === 1 ? gameState.rosco1 : gameState.rosco2;
    const teamState = team === 1 ? gameState.team1 : gameState.team2;
    return rosco[teamState.currentLetterIndex] || null;
  };

  // Vista de Administrador
  if (role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4">
        <ConnectionStatus isConnected={isConnected} />

        <div className="max-w-7xl mx-auto">
          <header className="flex items-center justify-between py-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Pasapalabra</h1>
                <p className="text-sm text-gray-500">Panel de Administrador</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setRole(null)}>
              Cambiar Rol
            </Button>
          </header>

          {gameState?.isActive && (
            <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rosco Equipo 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-blue-700">Equipo 1</h3>
                  <Timer
                    timeLeft={gameState.team1.timeLeft}
                    isRunning={gameState.team1.isTimerRunning}
                    team={1}
                    isActive={gameState.currentTeam === 1}
                  />
                </div>
                <div className="flex justify-center">
                  <Rosco
                    words={gameState.rosco1}
                    currentLetterIndex={gameState.team1.currentLetterIndex}
                    team={1}
                    isActive={gameState.currentTeam === 1}
                    size="medium"
                  />
                </div>
                <div className="mt-4">
                  <DefinitionCard
                    word={getCurrentWord(1)}
                    team={1}
                    isActive={gameState.currentTeam === 1}
                    forceShow={true}
                  />
                </div>
              </div>

              {/* Rosco Equipo 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-orange-700">Equipo 2</h3>
                  <Timer
                    timeLeft={gameState.team2.timeLeft}
                    isRunning={gameState.team2.isTimerRunning}
                    team={2}
                    isActive={gameState.currentTeam === 2}
                  />
                </div>
                <div className="flex justify-center">
                  <Rosco
                    words={gameState.rosco2}
                    currentLetterIndex={gameState.team2.currentLetterIndex}
                    team={2}
                    isActive={gameState.currentTeam === 2}
                    size="medium"
                  />
                </div>
                <div className="mt-4">
                  <DefinitionCard
                    word={getCurrentWord(2)}
                    team={2}
                    isActive={gameState.currentTeam === 2}
                    forceShow={true}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <AdminPanel
              onCreateRosco={createRosco}
              onResetGame={resetGame}
              isGameActive={gameState?.isActive || false}
            />
          </div>

          {gameState?.winner && (
            <GameWinner
              winner={gameState.winner}
              team1Correct={gameState.team1.correct}
              team1Wrong={gameState.team1.wrong}
              team1TimeLeft={gameState.team1.timeLeft}
              team2Correct={gameState.team2.correct}
              team2Wrong={gameState.team2.wrong}
              team2TimeLeft={gameState.team2.timeLeft}
              onReset={resetGame}
            />
          )}
        </div>
      </div>
    );
  }

  // Vista de Jugador Equipo 1
  if (role === 'player1') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
        <ConnectionStatus isConnected={isConnected} />

        <div className="max-w-4xl mx-auto">
          <header className="flex items-center justify-between py-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Pasapalabra</h1>
                <p className="text-sm text-blue-600 font-medium">Equipo 1</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <Button variant="outline" onClick={() => setRole(null)}>
                Cambiar Rol
              </Button>
            </div>
          </header>

          {!gameState?.isActive ? (
            <div className="text-center py-20">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Esperando al administrador</h2>
              <p className="text-gray-500">El juego comenzará cuando el administrador cree el rosco</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Timer y Score */}
              <div className="flex justify-center">
                <Timer
                  timeLeft={gameState.team1.timeLeft}
                  isRunning={gameState.team1.isTimerRunning}
                  team={1}
                  isActive={gameState.currentTeam === 1}
                />
              </div>

              {/* Rosco */}
              <div className="flex justify-center">
                <Rosco
                  words={gameState.rosco1}
                  currentLetterIndex={gameState.team1.currentLetterIndex}
                  team={1}
                  isActive={gameState.currentTeam === 1}
                  size="large"
                />
              </div>

              {/* Definición */}
              <div className="flex justify-center">
                <DefinitionCard
                  word={getCurrentWord(1)}
                  team={1}
                  isActive={gameState.currentTeam === 1}
                />
              </div>

              {/* Controles */}
              <div className="flex justify-center">
                <PlayerControls
                  team={1}
                  isActive={gameState.currentTeam === 1}
                  onGuess={(guess) => handleGuess(1, guess)}
                  onPass={() => handlePass(1)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista de Jugador Equipo 2
  if (role === 'player2') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
        <ConnectionStatus isConnected={isConnected} />

        <div className="max-w-4xl mx-auto">
          <header className="flex items-center justify-between py-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Pasapalabra</h1>
                <p className="text-sm text-orange-600 font-medium">Equipo 2</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <Button variant="outline" onClick={() => setRole(null)}>
                Cambiar Rol
              </Button>
            </div>
          </header>

          {!gameState?.isActive ? (
            <div className="text-center py-20">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Esperando al administrador</h2>
              <p className="text-gray-500">El juego comenzará cuando el administrador cree el rosco</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Timer y Score */}
              <div className="flex justify-center">
                <Timer
                  timeLeft={gameState.team2.timeLeft}
                  isRunning={gameState.team2.isTimerRunning}
                  team={2}
                  isActive={gameState.currentTeam === 2}
                />
              </div>

              {/* Rosco */}
              <div className="flex justify-center">
                <Rosco
                  words={gameState.rosco2}
                  currentLetterIndex={gameState.team2.currentLetterIndex}
                  team={2}
                  isActive={gameState.currentTeam === 2}
                  size="large"
                />
              </div>

              {/* Definición */}
              <div className="flex justify-center">
                <DefinitionCard
                  word={getCurrentWord(2)}
                  team={2}
                  isActive={gameState.currentTeam === 2}
                />
              </div>

              {/* Controles */}
              <div className="flex justify-center">
                <PlayerControls
                  team={2}
                  isActive={gameState.currentTeam === 2}
                  onGuess={(guess) => handleGuess(2, guess)}
                  onPass={() => handlePass(2)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista de Espectador
  if (role === 'spectator') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4">
        <ConnectionStatus isConnected={isConnected} />

        <div className="max-w-7xl mx-auto">
          <header className="flex items-center justify-between py-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Pasapalabra</h1>
                <p className="text-sm text-gray-500">Modo Espectador</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setRole(null)}>
              Cambiar Rol
            </Button>
          </header>

          {!gameState?.isActive ? (
            <div className="text-center py-20">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Esperando al administrador</h2>
              <p className="text-gray-500">El juego comenzará cuando el administrador cree el rosco</p>
            </div>
          ) : (
            <>
              {/* Scoreboard */}
              <div className="flex justify-center mb-6">
                <ScoreBoard
                  team1Correct={gameState.team1.correct}
                  team1Wrong={gameState.team1.wrong}
                  team2Correct={gameState.team2.correct}
                  team2Wrong={gameState.team2.wrong}
                  currentTeam={gameState.currentTeam}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Equipo 1 */}
                <div className={cn(
                  "bg-white rounded-2xl p-6 shadow-lg border-2 transition-all",
                  gameState.currentTeam === 1 ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
                )}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-blue-700">Equipo 1</h3>
                    <Timer
                      timeLeft={gameState.team1.timeLeft}
                      isRunning={gameState.team1.isTimerRunning}
                      team={1}
                      isActive={gameState.currentTeam === 1}
                    />
                  </div>
                  <div className="flex justify-center mb-4">
                    <Rosco
                      words={gameState.rosco1}
                      currentLetterIndex={gameState.team1.currentLetterIndex}
                      team={1}
                      isActive={gameState.currentTeam === 1}
                      size="medium"
                    />
                  </div>
                  <DefinitionCard
                    word={getCurrentWord(1)}
                    team={1}
                    isActive={gameState.currentTeam === 1}
                    forceShow={true}
                  />
                </div>

                {/* Equipo 2 */}
                <div className={cn(
                  "bg-white rounded-2xl p-6 shadow-lg border-2 transition-all",
                  gameState.currentTeam === 2 ? 'border-orange-500 ring-2 ring-orange-200' : 'border-transparent'
                )}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-orange-700">Equipo 2</h3>
                    <Timer
                      timeLeft={gameState.team2.timeLeft}
                      isRunning={gameState.team2.isTimerRunning}
                      team={2}
                      isActive={gameState.currentTeam === 2}
                    />
                  </div>
                  <div className="flex justify-center mb-4">
                    <Rosco
                      words={gameState.rosco2}
                      currentLetterIndex={gameState.team2.currentLetterIndex}
                      team={2}
                      isActive={gameState.currentTeam === 2}
                      size="medium"
                    />
                  </div>
                  <DefinitionCard
                    word={getCurrentWord(2)}
                    team={2}
                    isActive={gameState.currentTeam === 2}
                  />
                </div>
              </div>
            </>
          )}

          {gameState?.winner && (
            <GameWinner
              winner={gameState.winner}
              team1Correct={gameState.team1.correct}
              team1Wrong={gameState.team1.wrong}
              team1TimeLeft={gameState.team1.timeLeft}
              team2Correct={gameState.team2.correct}
              team2Wrong={gameState.team2.wrong}
              team2TimeLeft={gameState.team2.timeLeft}
              onReset={resetGame}
            />
          )}
        </div>
      </div>
    );
  }

  // Selector de rol
  return <RoleSelector onSelectRole={setRole} />;
}

export default App;
