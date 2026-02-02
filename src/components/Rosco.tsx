import type { WordItem } from '@/types/game';
import { cn } from '@/lib/utils';

interface RoscoProps {
  words: WordItem[];
  currentLetterIndex: number;
  team: 1 | 2;
  isActive: boolean;
  size?: 'small' | 'medium' | 'large';
}

const LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

export function Rosco({ words, currentLetterIndex, team, isActive, size = 'large' }: RoscoProps) {
  const sizeClasses = {
    small: 'w-48 h-48 text-xs',
    medium: 'w-72 h-72 text-sm',
    large: 'w-96 h-96 text-base'
  };

  const letterSizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-10 h-10'
  };

  const getLetterStatus = (index: number): 'pending' | 'correct' | 'wrong' | 'passed' | 'current' => {
    if (!words[index]) return 'pending';
    if (index === currentLetterIndex && isActive) return 'current';
    return words[index].status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct':
        return 'bg-green-500 text-white border-green-600';
      case 'wrong':
        return 'bg-red-500 text-white border-red-600';
      case 'passed':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'current':
        return team === 1
          ? 'bg-blue-500 text-white border-blue-600 animate-pulse ring-4 ring-blue-300'
          : 'bg-orange-500 text-white border-orange-600 animate-pulse ring-4 ring-orange-300';
      default:
        return 'bg-white text-gray-700 border-gray-300';
    }
  };

  const radius = size === 'large' ? 160 : size === 'medium' ? 120 : 80;
  const centerX = size === 'large' ? 192 : size === 'medium' ? 144 : 96;
  const centerY = size === 'large' ? 192 : size === 'medium' ? 144 : 96;

  return (
    <div className={cn("relative rounded-full border-4 border-gray-200 bg-gray-50", sizeClasses[size])}>
      {/* Centro del rosco */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn(
          "rounded-full flex items-center justify-center font-bold text-2xl",
          team === 1 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600',
          size === 'large' ? 'w-24 h-24' : size === 'medium' ? 'w-16 h-16' : 'w-12 h-12'
        )}>
          {team === 1 ? 'E1' : 'E2'}
        </div>
      </div>

      {/* Letras del rosco */}
      {LETTERS.map((letter, index) => {
        const angle = (index * 360 / LETTERS.length) - 90; // Empezar desde arriba
        const radian = (angle * Math.PI) / 180;
        const x = centerX + radius * Math.cos(radian);
        const y = centerY + radius * Math.sin(radian);
        const status = getLetterStatus(index);

        return (
          <div
            key={letter}
            className={cn(
              "absolute rounded-full flex items-center justify-center font-bold border-2 shadow-md transition-all duration-300",
              letterSizeClasses[size],
              getStatusColor(status)
            )}
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
}
