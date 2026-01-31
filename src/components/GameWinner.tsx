import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Trophy, RotateCcw, Medal } from 'lucide-react';

interface GameWinnerProps {
  winner: 1 | 2;
  team1Correct: number;
  team1Wrong: number;
  team1TimeLeft: number;
  team2Correct: number;
  team2Wrong: number;
  team2TimeLeft: number;
  onReset: () => void;
}

export function GameWinner({
  winner,
  team1Correct,
  team1Wrong,
  team1TimeLeft,
  team2Correct,
  team2Wrong,
  team2TimeLeft,
  onReset
}: GameWinnerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full text-center animate-in zoom-in-95 duration-300">
        {/* Header con trofeo */}
        <div className="mb-6">
          <div className={cn(
            "w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4",
            winner === 1 ? 'bg-blue-100' : 'bg-orange-100'
          )}>
            <Trophy className={cn(
              "w-14 h-14",
              winner === 1 ? 'text-blue-600' : 'text-orange-600'
            )} />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            ¡Equipo {winner} Gana!
          </h2>
          <p className="text-gray-600">
            {winner === 1 
              ? '¡El equipo azul se lleva la victoria!' 
              : '¡El equipo naranja se lleva la victoria!'}
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Equipo 1 */}
          <div className={cn(
            "p-4 rounded-2xl border-2",
            winner === 1 
              ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' 
              : 'bg-gray-50 border-gray-200'
          )}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Medal className={cn(
                "w-5 h-5",
                winner === 1 ? 'text-blue-600' : 'text-gray-400'
              )} />
              <span className="font-bold text-lg">Equipo 1</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Aciertos:</span>
                <span className="font-bold text-green-600">{team1Correct}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fallos:</span>
                <span className="font-bold text-red-600">{team1Wrong}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tiempo restante:</span>
                <span className="font-bold text-blue-600">{formatTime(team1TimeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Equipo 2 */}
          <div className={cn(
            "p-4 rounded-2xl border-2",
            winner === 2 
              ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-200' 
              : 'bg-gray-50 border-gray-200'
          )}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Medal className={cn(
                "w-5 h-5",
                winner === 2 ? 'text-orange-600' : 'text-gray-400'
              )} />
              <span className="font-bold text-lg">Equipo 2</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Aciertos:</span>
                <span className="font-bold text-green-600">{team2Correct}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fallos:</span>
                <span className="font-bold text-red-600">{team2Wrong}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tiempo restante:</span>
                <span className="font-bold text-orange-600">{formatTime(team2TimeLeft)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de reinicio */}
        <Button 
          onClick={onReset}
          size="lg"
          className="w-full"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Jugar de Nuevo
        </Button>
      </div>
    </div>
  );
}
