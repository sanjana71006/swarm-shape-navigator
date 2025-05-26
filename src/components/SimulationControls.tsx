
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
        <CardTitle className="text-white text-lg">⚙️ Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">
            🔢 Swarm Size: {swarmSize} drones
          </label>
          <Slider
            value={[swarmSize]}
            onValueChange={(value) => onSwarmSizeChange(value[0])}
            max={300}
            min={20}
            step={10}
            className="w-full"
          />
          <div className="text-xs text-slate-400 mt-1">
            Recommended: 50-200 for best performance
          </div>
        </div>

        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">
            📏 Formation Size: {formationSize}
          </label>
          <Slider
            value={[formationSize]}
            onValueChange={(value) => onFormationSizeChange(value[0])}
            max={25}
            min={2}
            step={0.5}
            className="w-full"
          />
          <div className="text-xs text-slate-400 mt-1">
            Controls the scale of formations
          </div>
        </div>

        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">
            ⚡ Animation Speed: {animationSpeed}x
          </label>
          <Slider
            value={[animationSpeed]}
            onValueChange={(value) => onAnimationSpeedChange(value[0])}
            max={5}
            min={0.1}
            step={0.1}
            className="w-full"
          />
          <div className="text-xs text-slate-400 mt-1">
            Higher values = faster movement
          </div>
        </div>

        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">
            🔍 Zoom Level: {zoomLevel}
          </label>
          <Slider
            value={[zoomLevel]}
            onValueChange={(value) => onZoomChange(value[0])}
            max={80}
            min={5}
            step={2}
            className="w-full"
          />
          <div className="text-xs text-slate-400 mt-1">
            Camera distance from formation
          </div>
        </div>

        <Separator className="bg-slate-600/50" />

        <Button
          onClick={onPositionChange}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-green-500"
        >
          🎯 Change Target Position
        </Button>

        <Button
          onClick={() => onToggleAnimation(!isAnimating)}
          className={`w-full ${
            isAnimating
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-500'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-blue-500'
          }`}
        >
          {isAnimating ? '⏹️ Stop Animation' : '▶️ Start Animation'}
        </Button>

        <div className="bg-slate-600/30 rounded-lg p-3 mt-4">
          <h4 className="text-white text-sm font-semibold mb-2">💡 Pro Tips</h4>
          <ul className="text-slate-300 text-xs space-y-1">
            <li>• Start with Indian Flag formation</li>
            <li>• Try Peacock with Peacock colors</li>
            <li>• Use 150+ drones for complex shapes</li>
            <li>• Slower speeds show more detail</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
