import { cn } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className={cn(
      "fixed top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 z-50",
      isConnected 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700 animate-pulse'
    )}>
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>Conectado</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>Sin conexión</span>
        </>
      )}
    </div>
  );
}
