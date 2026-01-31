import { cn } from '@/lib/utils';

interface TimerProps {
  timeLeft: number;
  isRunning: boolean;
  team: 1 | 2;
  isActive: boolean;
}

export function Timer({ timeLeft, isRunning, team, isActive }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const formatTime = (value: number) => value.toString().padStart(2, '0');
  
  const isLowTime = timeLeft < 30;
  const isCritical = timeLeft < 10;

  return (
    <div className={cn(
      "flex flex-col items-center p-4 rounded-xl transition-all duration-300",
      isActive 
        ? team === 1 
          ? 'bg-blue-100 ring-4 ring-blue-400' 
          : 'bg-orange-100 ring-4 ring-orange-400'
        : 'bg-gray-100'
    )}>
      <span className="text-sm font-medium text-gray-600 mb-1">
        Equipo {team}
      </span>
      <div className={cn(
        "text-5xl font-mono font-bold tabular-nums transition-colors duration-300",
        isCritical ? 'text-red-600 animate-pulse' :
        isLowTime ? 'text-orange-600' :
        team === 1 ? 'text-blue-600' : 'text-orange-600'
      )}>
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className={cn(
          "w-3 h-3 rounded-full",
          isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        )} />
        <span className="text-xs text-gray-500">
          {isRunning ? 'Corriendo' : 'Pausado'}
        </span>
      </div>
    </div>
  );
}
