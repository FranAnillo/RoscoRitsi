import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Play, RotateCcw, Plus, Trash2, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';
import { LETTERS } from '@/types/game';
import type { RoscoInput } from '@/types/game';

interface AdminPanelProps {
  onCreateRosco: (rosco1: RoscoInput[], rosco2: RoscoInput[]) => void;
  onResetGame: () => void;
  isGameActive: boolean;
}

export function AdminPanel({ onCreateRosco, onResetGame, isGameActive }: AdminPanelProps) {
  const [rosco1, setRosco1] = useState<RoscoInput[]>(
    LETTERS.map(() => ({ word: '', definition: '', type: 'starts' }))
  );
  const [rosco2, setRosco2] = useState<RoscoInput[]>(
    LETTERS.map(() => ({ word: '', definition: '', type: 'starts' }))
  );
  const [activeTab, setActiveTab] = useState<'team1' | 'team2'>('team1');

  const updateRosco1 = (index: number, field: keyof RoscoInput, value: any) => {
    const newRosco = [...rosco1];
    newRosco[index] = { ...newRosco[index], [field]: value };
    setRosco1(newRosco);
  };

  const updateRosco2 = (index: number, field: keyof RoscoInput, value: any) => {
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
    const exampleWords1: RoscoInput[] = [
      { word: 'ÁRBOL', definition: 'Planta de tronco leñoso que se ramifica a cierta altura del suelo', type: 'starts' },
      { word: 'BARCO', definition: 'Embarcación de gran tamaño para navegar', type: 'starts' },
      { word: 'CASA', definition: 'Edificio para habitar', type: 'starts' },
      { word: 'DEDO', definition: 'Cada uno de los cinco apéndices de la mano', type: 'starts' },
      { word: 'ELEFANTE', definition: 'Mamífero paquidermo de gran tamaño con trompa', type: 'starts' },
      { word: 'FLOR', definition: 'Órgano reproductor de las plantas', type: 'starts' },
      { word: 'GATO', definition: 'Mamífero felino doméstico', type: 'starts' },
      { word: 'HOGAR', definition: 'Lugar donde vive una persona', type: 'starts' },
      { word: 'ISLA', definition: 'Porción de tierra rodeada de agua', type: 'starts' },
      { word: 'JARDÍN', definition: 'Terreno donde se cultivan plantas', type: 'starts' },
      { word: 'KOALA', definition: 'Marsupial australiano que vive en los eucaliptos', type: 'starts' },
      { word: 'LUNA', definition: 'Satélite natural de la Tierra', type: 'starts' },
      { word: 'MESA', definition: 'Mueble con patas y una superficie plana', type: 'starts' },
      { word: 'NIÑO', definition: 'Persona de poca edad', type: 'starts' },
      { word: 'ÑANDÚ', definition: 'Ave corredora sudamericana', type: 'starts' },
      { word: 'OSO', definition: 'Mamífero carnívoro de gran tamaño', type: 'starts' },
      { word: 'PERRO', definition: 'Mamífero doméstico, mejor amigo del hombre', type: 'starts' },
      { word: 'QUESO', definition: 'Producto lácteo sólido', type: 'starts' },
      { word: 'RATÓN', definition: 'Roedor de pequeño tamaño', type: 'starts' },
      { word: 'SOL', definition: 'Estrella que ilumina la Tierra', type: 'starts' },
      { word: 'TIGRE', definition: 'Felino salvaje de rayas naranjas', type: 'starts' },
      { word: 'UVA', definition: 'Fruto de la vid', type: 'starts' },
      { word: 'VACA', definition: 'Mamífero rumiante que produce leche', type: 'starts' },
      { word: 'WHISKY', definition: 'Bebida alcohólica destilada', type: 'starts' },
      { word: 'XILÓFONO', definition: 'Instrumento musical de percusión', type: 'starts' },
      { word: 'YATE', definition: 'Embarcación de recreo', type: 'starts' },
      { word: 'ZORRO', definition: 'Mamífero carnívoro de cola abundante', type: 'starts' },
    ];

    const exampleWords2: RoscoInput[] = [
      { word: 'AMIGO', definition: 'Persona con quien se tiene una relación de afecto', type: 'starts' },
      { word: 'BICICLETA', definition: 'Vehículo de dos ruedas movido por pedales', type: 'starts' },
      { word: 'CIELO', definition: 'Espacio que rodea la Tierra', type: 'starts' },
      { word: 'DINERO', definition: 'Medio de cambio para adquirir bienes', type: 'starts' },
      { word: 'ESPEJO', definition: 'Superficie que refleja las imágenes', type: 'starts' },
      { word: 'FUEGO', definition: 'Combustión que desprende luz y calor', type: 'starts' },
      { word: 'GUITARRA', definition: 'Instrumento musical de cuerdas', type: 'starts' },
      { word: 'HÉROE', definition: 'Persona que realiza hazañas', type: 'starts' },
      { word: 'IGLESIA', definition: 'Edificio para el culto religioso', type: 'starts' },
      { word: 'JUEGO', definition: 'Actividad recreativa con reglas', type: 'starts' },
      { word: 'KIWI', definition: 'Fruta de piel marrón y pulpa verde', type: 'starts' },
      { word: 'LIBRO', definition: 'Conjunto de hojas con texto impreso', type: 'starts' },
      { word: 'MONTAÑA', definition: 'Gran elevación del terreno', type: 'starts' },
      { word: 'NUBE', definition: 'Masa visible de vapor de agua', type: 'starts' },
      { word: 'ÑOQUI', definition: 'Pasta italiana hecha de patata', type: 'starts' },
      { word: 'OCÉANO', definition: 'Gran extensión de agua salada', type: 'starts' },
      { word: 'PIANO', definition: 'Instrumento musical de teclas', type: 'starts' },
      { word: 'QUINTO', definition: 'Número ordinal que sigue al cuarto', type: 'starts' },
      { word: 'RÍO', definition: 'Corriente natural de agua', type: 'starts' },
      { word: 'SILLA', definition: 'Asiento con respaldo y patas', type: 'starts' },
      { word: 'TELÉFONO', definition: 'Aparato para comunicarse a distancia', type: 'starts' },
      { word: 'UNIVERSO', definition: 'Conjunto de todo lo existente', type: 'starts' },
      { word: 'VIOLÍN', definition: 'Instrumento musical de cuerdas frotadas', type: 'starts' },
      { word: 'WATERPOLO', definition: 'Deporte acuático con balón', type: 'starts' },
      { word: 'XENÓFOBO', definition: 'Persona que teme lo extranjero', type: 'starts' },
      { word: 'YOGUR', definition: 'Producto lácteo fermentado', type: 'starts' },
      { word: 'ZAPATO', definition: 'Calzado que cubre el pie', type: 'starts' },
    ];

    setRosco1(exampleWords1);
    setRosco2(exampleWords2);
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as string[][];
        const newRosco1 = [...rosco1];
        const newRosco2 = [...rosco2];

        data.forEach((row) => {
          if (row.length < 5) return;
          const [team, letter, type, word, definition] = row.map(s => s.trim());
          const letterIndex = LETTERS.findIndex(l => l === letter.toUpperCase());

          if (letterIndex === -1) return;

          const item: RoscoInput = {
            word: word.toUpperCase(),
            definition,
            type: type.toLowerCase() === 'contiene' || type.toLowerCase() === 'contains' ? 'contains' : 'starts'
          };

          if (team === '1') {
            newRosco1[letterIndex] = item;
          } else if (team === '2') {
            newRosco2[letterIndex] = item;
          }
        });

        setRosco1(newRosco1);
        setRosco2(newRosco2);
      },
      header: false
    });
  };

  const clearAll = () => {
    setRosco1(LETTERS.map(() => ({ word: '', definition: '', type: 'starts' })));
    setRosco2(LETTERS.map(() => ({ word: '', definition: '', type: 'starts' })));
  };

  const RoscoForm = ({
    rosco,
    updateRosco,
    team
  }: {
    rosco: RoscoInput[];
    updateRosco: (index: number, field: keyof RoscoInput, value: any) => void;
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
            <div className="flex gap-2">
              <select
                value={rosco[index]?.type || 'starts'}
                onChange={(e) => updateRosco(index, 'type', e.target.value as 'starts' | 'contains')}
                className="text-xs border rounded px-1 bg-white"
              >
                <option value="starts">Empieza por</option>
                <option value="contains">Contiene</option>
              </select>
              <Input
                placeholder="Palabra"
                value={rosco[index]?.word || ''}
                onChange={(e) => updateRosco(index, 'word', e.target.value.toUpperCase())}
                className="uppercase flex-1"
              />
            </div>
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
              asChild
              disabled={isGameActive}
            >
              <label className="cursor-pointer flex items-center">
                <Plus className="w-4 h-4 mr-1" />
                Importar CSV
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCsvUpload}
                  disabled={isGameActive}
                />
              </label>
            </Button>
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
        <div className="mb-4 text-xs text-gray-500 bg-gray-50 p-2 rounded border">
          <p><strong>Formato CSV:</strong> Equipo (1 o 2), Letra, Tipo (empieza/contiene), Palabra, Definición</p>
          <p>Ejemplo: 1, A, empieza, ÁRBOL, Planta de tronco leñoso...</p>
        </div>
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
    </Card >
  );
}
