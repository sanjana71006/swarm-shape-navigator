
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle, Square, Line, Random } from 'lucide-react';
import type { FormationType, ColorMode } from '@/pages/Index';

interface FormationControlsProps {
  formation: FormationType;
  onFormationChange: (formation: FormationType) => void;
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
}

export const FormationControls = ({
  formation,
  onFormationChange,
  colorMode,
  onColorModeChange,
}: FormationControlsProps) => {
  const formations: { type: FormationType; label: string; icon: React.ReactNode }[] = [
    { type: 'line', label: 'Line', icon: <Line size={16} /> },
    { type: 'circle', label: 'Circle', icon: <Circle size={16} /> },
    { type: 'square', label: 'Square', icon: <Square size={16} /> },
    { type: 'random', label: 'Random', icon: <Random size={16} /> },
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-slate-700/30 border-slate-600/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Formation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {formations.map(({ type, label, icon }) => (
            <Button
              key={type}
              variant={formation === type ? "default" : "outline"}
              className={`w-full justify-start gap-2 ${
                formation === type
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
                  : 'bg-slate-600/30 hover:bg-slate-600/50 text-slate-200 border-slate-500/50'
              }`}
              onClick={() => onFormationChange(type)}
            >
              {icon}
              {label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-slate-700/30 border-slate-600/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Color Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={colorMode === 'by_index' ? "default" : "outline"}
            className={`w-full ${
              colorMode === 'by_index'
                ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500'
                : 'bg-slate-600/30 hover:bg-slate-600/50 text-slate-200 border-slate-500/50'
            }`}
            onClick={() => onColorModeChange('by_index')}
          >
            By Index
          </Button>
          <Button
            variant={colorMode === 'by_distance' ? "default" : "outline"}
            className={`w-full ${
              colorMode === 'by_distance'
                ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500'
                : 'bg-slate-600/30 hover:bg-slate-600/50 text-slate-200 border-slate-500/50'
            }`}
            onClick={() => onColorModeChange('by_distance')}
          >
            By Distance
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
