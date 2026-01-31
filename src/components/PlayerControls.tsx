import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Send, SkipForward } from 'lucide-react';

interface PlayerControlsProps {
  team: 1 | 2;
  isActive: boolean;
  onGuess: (guess: string) => void;
  onPass: () => void;
  disabled?: boolean;
}

export function PlayerControls({ 
  team, 
  isActive, 
  onGuess, 
  onPass, 
  disabled = false 
}: PlayerControlsProps) {
  const [guess, setGuess] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus cuando es el turno
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !disabled) {
      onGuess(guess.trim());
      setGuess('');
    }
  };

  const handlePass = () => {
    if (!disabled) {
      onPass();
      setGuess('');
    }
  };

  return (
    <div className={cn(
      "w-full max-w-2xl p-6 rounded-2xl border-2 transition-all duration-300",
      isActive 
        ? team === 1 
          ? 'bg-blue-50 border-blue-400' 
          : 'bg-orange-50 border-orange-400'
        : 'bg-gray-50 border-gray-200 opacity-60'
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className={cn(
          "font-bold",
          team === 1 ? 'text-blue-700' : 'text-orange-700'
        )}>
          Equipo {team} - Tu turno
        </span>
        {isActive && (
          <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full animate-pulse">
            ¡Juega!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value.toUpperCase())}
            placeholder="Escribe tu respuesta..."
            disabled={!isActive || disabled}
            className={cn(
              "flex-1 text-lg uppercase tracking-wider",
              team === 1 
                ? 'focus-visible:ring-blue-500' 
                : 'focus-visible:ring-orange-500'
            )}
          />
          <Button
            type="submit"
            disabled={!isActive || disabled || !guess.trim()}
            className={cn(
              "px-6",
              team === 1 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-orange-600 hover:bg-orange-700'
            )}
          >
            <Send className="w-5 h-5 mr-2" />
            Responder
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handlePass}
          disabled={!isActive || disabled}
          className={cn(
            "w-full",
            team === 1 
              ? 'border-blue-400 text-blue-700 hover:bg-blue-100' 
              : 'border-orange-400 text-orange-700 hover:bg-orange-100'
          )}
        >
          <SkipForward className="w-5 h-5 mr-2" />
          Pasapalabra
        </Button>
      </form>
    </div>
  );
}
