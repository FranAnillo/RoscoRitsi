import type { UserRole } from '@/types/game';
import { cn } from '@/lib/utils';
import { UserCog, Users, Eye, Gamepad2 } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const roles = [
    {
      role: 'admin' as UserRole,
      title: 'Administrador',
      description: 'Crea el rosco y controla el juego',
      icon: UserCog,
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
      borderColor: 'border-purple-300'
    },
    {
      role: 'player1' as UserRole,
      title: 'Equipo 1',
      description: 'Juega como el equipo azul',
      icon: Users,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      borderColor: 'border-blue-300'
    },
    {
      role: 'player2' as UserRole,
      title: 'Equipo 2',
      description: 'Juega como el equipo naranja',
      icon: Users,
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
      borderColor: 'border-orange-300'
    },
    {
      role: 'spectator' as UserRole,
      title: 'Espectador',
      description: 'Observa el juego en tiempo real',
      icon: Eye,
      color: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
      borderColor: 'border-gray-300'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              Pasapalabra
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Elige tu rol para comenzar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map(({ role, title, description, icon: Icon, color, borderColor }) => (
            <button
              key={role}
              onClick={() => onSelectRole(role)}
              className={cn(
                "p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg",
                color,
                borderColor
              )}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/50">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{title}</h3>
                  <p className="text-sm opacity-80">{description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Conecta varios dispositivos para jugar en tiempo real</p>
        </div>
      </div>
    </div>
  );
}
