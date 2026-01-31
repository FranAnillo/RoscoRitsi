import { cn } from '@/lib/utils';

interface ScoreBoardProps {
  team1Correct: number;
  team1Wrong: number;
  team2Correct: number;
  team2Wrong: number;
  currentTeam: 1 | 2;
}

export function ScoreBoard({ 
  team1Correct, 
  team1Wrong, 
  team2Correct, 
  team2Wrong, 
  currentTeam 
}: ScoreBoardProps) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
      {/* Equipo 1 */}
      <div className={cn(
        "p-4 rounded-xl border-2 transition-all duration-300",
        currentTeam === 1 
          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' 
          : 'bg-white border-gray-200'
      )}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-lg text-blue-700">Equipo 1</span>
          {currentTeam === 1 && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full animate-pulse">
              Jugando
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-100 rounded-lg p-2 text-center">
            <span className="text-xs text-green-700 block">Aciertos</span>
            <span className="text-2xl font-bold text-green-600">{team1Correct}</span>
          </div>
          <div className="bg-red-100 rounded-lg p-2 text-center">
            <span className="text-xs text-red-700 block">Fallos</span>
            <span className="text-2xl font-bold text-red-600">{team1Wrong}</span>
          </div>
        </div>
      </div>

      {/* Equipo 2 */}
      <div className={cn(
        "p-4 rounded-xl border-2 transition-all duration-300",
        currentTeam === 2 
          ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-200' 
          : 'bg-white border-gray-200'
      )}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-lg text-orange-700">Equipo 2</span>
          {currentTeam === 2 && (
            <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full animate-pulse">
              Jugando
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-100 rounded-lg p-2 text-center">
            <span className="text-xs text-green-700 block">Aciertos</span>
            <span className="text-2xl font-bold text-green-600">{team2Correct}</span>
          </div>
          <div className="bg-red-100 rounded-lg p-2 text-center">
            <span className="text-xs text-red-700 block">Fallos</span>
            <span className="text-2xl font-bold text-red-600">{team2Wrong}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
