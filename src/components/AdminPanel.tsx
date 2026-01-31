import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Play, RotateCcw, Plus, Trash2, CheckCircle } from 'lucide-react';
import { LETTERS } from '@/types/game';

interface RoscoInput {
  word: string;
  definition: string;
}

interface AdminPanelProps {
  onCreateRosco: (rosco1: RoscoInput[], rosco2: RoscoInput[]) => void;
  onResetGame: () => void;
  isGameActive: boolean;
}

export function AdminPanel({ onCreateRosco, onResetGame, isGameActive }: AdminPanelProps) {
  const [rosco1, setRosco1] = useState<RoscoInput[]>(
    LETTERS.map(() => ({ word: '', definition: '' }))
  );
  const [rosco2, setRosco2] = useState<RoscoInput[]>(
    LETTERS.map(() => ({ word: '', definition: '' }))
  );
  const [activeTab, setActiveTab] = useState<'team1' | 'team2'>('team1');

  const updateRosco1 = (index: number, field: keyof RoscoInput, value: string) => {
    const newRosco = [...rosco1];
    newRosco[index] = { ...newRosco[index], [field]: value };
    setRosco1(newRosco);
  };

  const updateRosco2 = (index: number, field: keyof RoscoInput, value: string) => {
    const newRosco = [...rosco2];
    newRosco[index] = { ...newRosco[index], [field]: value };
    setRosco2(newRosco);
  };

  const handleCreateRosco = () => {
    // Validar que todas las palabras tengan contenido
    const validRosco1 = rosco1.filter(item => item.word.trim() && item.definition.trim());
    const validRosco2 = rosco2.filter(item => item.word.trim() && item.definition.trim());
    
    if (validRosco1.length < LETTERS.length || validRosco2.length < LETTERS.length) {
      alert(`Debes completar todas las ${LETTERS.length} letras para cada equipo`);
      return;
    }
    
    onCreateRosco(validRosco1, validRosco2);
  };

  const fillExampleData = () => {
    const exampleWords1 = [
      { word: 'ÁRBOL', definition: 'Planta de tronco leñoso que se ramifica a cierta altura del suelo' },
      { word: 'BARCO', definition: 'Embarcación de gran tamaño para navegar' },
      { word: 'CASA', definition: 'Edificio para habitar' },
      { word: 'DEDO', definition: 'Cada uno de los cinco apéndices de la mano' },
      { word: 'ELEFANTE', definition: 'Mamífero paquidermo de gran tamaño con trompa' },
      { word: 'FLOR', definition: 'Órgano reproductor de las plantas' },
      { word: 'GATO', definition: 'Mamífero felino doméstico' },
      { word: 'HOGAR', definition: 'Lugar donde vive una persona' },
      { word: 'ISLA', definition: 'Porción de tierra rodeada de agua' },
      { word: 'JARDÍN', definition: 'Terreno donde se cultivan plantas' },
      { word: 'KOALA', definition: 'Marsupial australiano que vive en los eucaliptos' },
      { word: 'LUNA', definition: 'Satélite natural de la Tierra' },
      { word: 'LLAVE', definition: 'Instrumento para abrir cerraduras' },
      { word: 'MESA', definition: 'Mueble con patas y una superficie plana' },
      { word: 'NIÑO', definition: 'Persona de poca edad' },
      { word: 'ÑANDÚ', definition: 'Ave corredora sudamericana' },
      { word: 'OSO', definition: 'Mamífero carnívoro de gran tamaño' },
      { word: 'PERRO', definition: 'Mamífero doméstico, mejor amigo del hombre' },
      { word: 'QUESO', definition: 'Producto lácteo sólido' },
      { word: 'RATÓN', definition: 'Roedor de pequeño tamaño' },
      { word: 'SOL', definition: 'Estrella que ilumina la Tierra' },
      { word: 'TIGRE', definition: 'Felino salvaje de rayas naranjas' },
      { word: 'UVA', definition: 'Fruto de la vid' },
      { word: 'VACA', definition: 'Mamífero rumiante que produce leche' },
      { word: 'WHISKY', definition: 'Bebida alcohólica destilada' },
      { word: 'XILÓFONO', definition: 'Instrumento musical de percusión' },
      { word: 'YATE', definition: 'Embarcación de recreo' },
      { word: 'ZORRO', definition: 'Mamífero carnívoro de cola abundante' },
    ];

    const exampleWords2 = [
      { word: 'AMIGO', definition: 'Persona con quien se tiene una relación de afecto' },
      { word: 'BICICLETA', definition: 'Vehículo de dos ruedas movido por pedales' },
      { word: 'CIELO', definition: 'Espacio que rodea la Tierra' },
      { word: 'DINERO', definition: 'Medio de cambio para adquirir bienes' },
      { word: 'ESPEJO', definition: 'Superficie que refleja las imágenes' },
      { word: 'FUEGO', definition: 'Combustión que desprende luz y calor' },
      { word: 'GUITARRA', definition: 'Instrumento musical de cuerdas' },
      { word: 'HÉROE', definition: 'Persona que realiza hazañas' },
      { word: 'IGLESIA', definition: 'Edificio para el culto religioso' },
      { word: 'JUEGO', definition: 'Actividad recreativa con reglas' },
      { word: 'KIWI', definition: 'Fruta de piel marrón y pulpa verde' },
      { word: 'LIBRO', definition: 'Conjunto de hojas con texto impreso' },
      { word: 'LLUVIA', definition: 'Precipitación de agua del cielo' },
      { word: 'MONTAÑA', definition: 'Gran elevación del terreno' },
      { word: 'NUBE', definition: 'Masa visible de vapor de agua' },
      { word: 'ÑOQUI', definition: 'Pasta italiana hecha de patata' },
      { word: 'OCÉANO', definition: 'Gran extensión de agua salada' },
      { word: 'PIANO', definition: 'Instrumento musical de teclas' },
      { word: 'QUINTO', definition: 'Número ordinal que sigue al cuarto' },
      { word: 'RÍO', definition: 'Corriente natural de agua' },
      { word: 'SILLA', definition: 'Asiento con respaldo y patas' },
      { word: 'TELÉFONO', definition: 'Aparato para comunicarse a distancia' },
      { word: 'UNIVERSO', definition: 'Conjunto de todo lo existente' },
      { word: 'VIOLÍN', definition: 'Instrumento musical de cuerdas frotadas' },
      { word: 'WATERPOLO', definition: 'Deporte acuático con balón' },
      { word: 'XENÓFOBO', definition: 'Persona que teme lo extranjero' },
      { word: 'YOGUR', definition: 'Producto lácteo fermentado' },
      { word: 'ZAPATO', definition: 'Calzado que cubre el pie' },
    ];

    setRosco1(exampleWords1);
    setRosco2(exampleWords2);
  };

  const clearAll = () => {
    setRosco1(LETTERS.map(() => ({ word: '', definition: '' })));
    setRosco2(LETTERS.map(() => ({ word: '', definition: '' })));
  };

  const RoscoForm = ({ 
    rosco, 
    updateRosco, 
    team 
  }: { 
    rosco: RoscoInput[]; 
    updateRosco: (index: number, field: keyof RoscoInput, value: string) => void;
    team: 1 | 2;
  }) => (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
      {LETTERS.map((letter, index) => (
        <div 
          key={letter} 
          className={cn(
            "flex gap-3 p-3 rounded-lg border",
            team === 1 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-orange-50 border-orange-200'
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0",
            team === 1 ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
          )}>
            {letter}
          </div>
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Palabra"
              value={rosco[index]?.word || ''}
              onChange={(e) => updateRosco(index, 'word', e.target.value.toUpperCase())}
              className="uppercase"
            />
            <Textarea
              placeholder="Definición"
              value={rosco[index]?.definition || ''}
              onChange={(e) => updateRosco(index, 'definition', e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Panel de Administrador - Crear Rosco</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fillExampleData}
              disabled={isGameActive}
            >
              <Plus className="w-4 h-4 mr-1" />
              Ejemplos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAll}
              disabled={isGameActive}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isGameActive ? (
          <>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'team1' | 'team2')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="team1" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Equipo 1
                </TabsTrigger>
                <TabsTrigger value="team2" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Equipo 2
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="team1">
                <RoscoForm rosco={rosco1} updateRosco={updateRosco1} team={1} />
              </TabsContent>
              
              <TabsContent value="team2">
                <RoscoForm rosco={rosco2} updateRosco={updateRosco2} team={2} />
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex gap-3">
              <Button 
                onClick={handleCreateRosco}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar Juego
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="mb-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-2">¡Juego en curso!</h3>
            <p className="text-gray-600 mb-6">
              El rosco ha sido creado y los equipos están jugando.
            </p>
            <Button 
              onClick={onResetGame}
              variant="destructive"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reiniciar Juego
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
