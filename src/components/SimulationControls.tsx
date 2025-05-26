
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

interface SimulationControlsProps {
  isAnimating: boolean;
  onToggleAnimation: (animating: boolean) => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  onPositionChange: () => void;
  targetPosition: number[];
  swarmSize: number;
  onSwarmSizeChange: (size: number) => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  formationSize: number;
  onFormationSizeChange: (size: number) => void;
}

export const SimulationControls = ({
  isAnimating,
  onToggleAnimation,
  zoomLevel,
  onZoomChange,
  onPositionChange,
  targetPosition,
  swarmSize,
  onSwarmSizeChange,
  animationSpeed,
  onAnimationSpeedChange,
  formationSize,
  onFormationSizeChange,
}: SimulationControlsProps) => {
  return (
    <Card className="bg-slate-700/30 border-slate-600/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">
            Swarm Size: {swarmSize}
          </label>
          <Slider
            value={[swarmSize]}
            onValueChange={(value) => onSwarmSizeChange(value[0])}
            max={200}
            min={10}
            step={5}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">
            Formation Size: {formationSize}
          </label>
          <Slider
            value={[formationSize]}
            onValueChange={(value) => onFormationSizeChange(value[0])}
            max={20}
            min={3}
            step={0.5}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">
            Animation Speed: {animationSpeed}x
          </label>
          <Slider
            value={[animationSpeed]}
            onValueChange={(value) => onAnimationSpeedChange(value[0])}
            max={3}
            min={0.1}
            step={0.1}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">
            Zoom Level: {zoomLevel}
          </label>
          <Slider
            value={[zoomLevel]}
            onValueChange={(value) => onZoomChange(value[0])}
            max={50}
            min={5}
            step={1}
            className="w-full"
          />
        </div>

        <Separator className="bg-slate-600/50" />

        <Button
          onClick={onPositionChange}
          className="w-full bg-green-600 hover:bg-green-700 text-white border-green-500"
        >
          Change Target Position
        </Button>

        <Button
          onClick={() => onToggleAnimation(!isAnimating)}
          className={`w-full ${
            isAnimating
              ? 'bg-red-600 hover:bg-red-700 text-white border-red-500'
              : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
          }`}
        >
          {isAnimating ? 'Stop Animation' : 'Start Animation'}
        </Button>
      </CardContent>
    </Card>
  );
};
