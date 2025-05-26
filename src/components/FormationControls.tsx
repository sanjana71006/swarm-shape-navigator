
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle, Square, Triangle } from 'lucide-react';
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
  const formations: { type: FormationType; label: string; icon: React.ReactNode; category: string }[] = [
    // Basic Shapes
    { type: 'line', label: 'Line', icon: <div className="w-4 h-1 bg-current" />, category: 'Basic' },
    { type: 'circle', label: 'Circle', icon: <Circle size={16} />, category: 'Basic' },
    { type: 'square', label: 'Square', icon: <Square size={16} />, category: 'Basic' },
    { type: 'triangle', label: 'Triangle', icon: <Triangle size={16} />, category: 'Basic' },
    { type: 'diamond', label: 'Diamond', icon: <div className="w-3 h-3 bg-current transform rotate-45" />, category: 'Basic' },
    
    // Complex Shapes
    { type: 'star', label: 'Star', icon: <div className="w-4 h-4 bg-current" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}} />, category: 'Complex' },
    { type: 'heart', label: 'Heart', icon: <div className="w-4 h-4 bg-current" style={{clipPath: 'path("M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z")'}} />, category: 'Complex' },
    { type: 'arrow', label: 'Arrow', icon: <div className="w-4 h-4 bg-current" style={{clipPath: 'polygon(40% 0%, 40% 20%, 100% 20%, 100% 30%, 40% 30%, 40% 50%, 0% 25%)'}} />, category: 'Complex' },
    { type: 'cross', label: 'Cross', icon: <div className="w-4 h-4 bg-current" style={{clipPath: 'polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)'}} />, category: 'Complex' },
    
    // 3D Shapes
    { type: 'sphere', label: 'Sphere', icon: <div className="w-4 h-4 bg-current rounded-full border-2 border-white/30" />, category: '3D' },
    { type: 'cylinder', label: 'Cylinder', icon: <div className="w-4 h-4 bg-current rounded-t-full border-2 border-white/30" />, category: '3D' },
    { type: 'pyramid', label: 'Pyramid', icon: <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-current" />, category: '3D' },
    
    // Dynamic Patterns
    { type: 'spiral', label: 'Spiral', icon: <div className="w-4 h-4 bg-current rounded-full" style={{background: 'conic-gradient(from 0deg, currentColor 0%, transparent 50%, currentColor 100%)'}} />, category: 'Dynamic' },
    { type: 'helix', label: 'Helix', icon: <div className="w-4 h-4 relative"><div className="absolute inset-0 bg-current rounded-full opacity-60"></div><div className="absolute inset-1 bg-current rounded-full opacity-80"></div></div>, category: 'Dynamic' },
    { type: 'wave', label: 'Wave', icon: <div className="w-4 h-2 bg-current" style={{clipPath: 'polygon(0% 50%, 25% 0%, 50% 50%, 75% 100%, 100% 50%, 100% 100%, 0% 100%)'}} />, category: 'Dynamic' },
    { type: 'figure8', label: 'Figure 8', icon: <div className="w-4 h-4 bg-current" style={{clipPath: 'path("M2,6 C2,3 4,1 7,1 C10,1 12,3 12,6 C12,9 10,11 7,11 C10,11 12,13 12,16 C12,19 10,21 7,21 C4,21 2,19 2,16 C2,13 4,11 7,11 C4,11 2,9 2,6 Z")'}} />, category: 'Dynamic' },
    
    // Vehicle Shapes
    { type: 'airplane', label: 'Airplane', icon: <div className="w-4 h-4 bg-current" style={{clipPath: 'polygon(50% 0%, 45% 25%, 10% 25%, 15% 40%, 40% 40%, 35% 70%, 20% 70%, 25% 85%, 45% 85%, 50% 100%, 55% 85%, 75% 85%, 80% 70%, 65% 70%, 60% 40%, 85% 40%, 90% 25%, 55% 25%)'}} />, category: 'Vehicles' },
    
    // Random
    { type: 'random', label: 'Random', icon: <div className="w-4 h-4 grid grid-cols-2 gap-0.5"><div className="w-1 h-1 bg-current rounded-full"></div><div className="w-1 h-1 bg-current rounded-full"></div><div className="w-1 h-1 bg-current rounded-full"></div><div className="w-1 h-1 bg-current rounded-full"></div></div>, category: 'Other' },
  ];

  const colorModes = [
    { mode: 'by_index' as ColorMode, label: 'By Index' },
    { mode: 'by_distance' as ColorMode, label: 'By Distance' },
    { mode: 'by_velocity' as ColorMode, label: 'By Velocity' },
    { mode: 'rainbow' as ColorMode, label: 'Rainbow' },
    { mode: 'temperature' as ColorMode, label: 'Temperature' },
  ];

  const categories = ['Basic', 'Complex', '3D', 'Dynamic', 'Vehicles', 'Other'];

  return (
    <div className="space-y-4">
      <Card className="bg-slate-700/30 border-slate-600/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Formation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {categories.map(category => {
            const categoryFormations = formations.filter(f => f.category === category);
            return (
              <div key={category} className="space-y-2">
                <h4 className="text-slate-300 text-sm font-medium">{category}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {categoryFormations.map(({ type, label, icon }) => (
                    <Button
                      key={type}
                      variant={formation === type ? "default" : "outline"}
                      className={`justify-start gap-2 text-xs ${
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
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="bg-slate-700/30 border-slate-600/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Color Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {colorModes.map(({ mode, label }) => (
            <Button
              key={mode}
              variant={colorMode === mode ? "default" : "outline"}
              className={`w-full ${
                colorMode === mode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500'
                  : 'bg-slate-600/30 hover:bg-slate-600/50 text-slate-200 border-slate-500/50'
              }`}
              onClick={() => onColorModeChange(mode)}
            >
              {label}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
