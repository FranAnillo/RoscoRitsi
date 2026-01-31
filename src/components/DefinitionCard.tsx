import type { WordItem } from '@/types/game';
import { cn } from '@/lib/utils';

interface DefinitionCardProps {
  word: WordItem | null;
  team: 1 | 2;
  isActive: boolean;
}

export function DefinitionCard({ word, team, isActive }: DefinitionCardProps) {
  if (!word) {
    return (
      <div className="w-full max-w-2xl p-8 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 text-center">
        <p className="text-gray-500 text-lg">
          Esperando a que comience el juego...
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full max-w-2xl p-8 rounded-2xl border-4 transition-all duration-300",
      isActive 
        ? team === 1 
          ? 'bg-blue-50 border-blue-500 shadow-lg shadow-blue-200' 
          : 'bg-orange-50 border-orange-500 shadow-lg shadow-orange-200'
        : 'bg-gray-50 border-gray-300'
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold",
          team === 1 ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
        )}>
          {word.letter}
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">Comienza con</span>
          <p className={cn(
            "text-2xl font-bold",
            team === 1 ? 'text-blue-600' : 'text-orange-600'
          )}>
            {word.letter}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-inner">
        <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-medium">
          Definición
        </p>
        <p className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed">
          {word.definition}
        </p>
      </div>

      {isActive && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            team === 1 ? 'bg-blue-500' : 'bg-orange-500'
          )} />
          <span className="text-sm text-gray-600">
            Turno del Equipo {team}
          </span>
        </div>
      )}
    </div>
  );
}
