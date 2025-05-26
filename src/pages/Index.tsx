
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { FormationControls } from '@/components/FormationControls';
import { DroneSwarm } from '@/components/DroneSwarm';
import { SimulationControls } from '@/components/SimulationControls';
import * as THREE from 'three';

// Extend the JSX namespace to include Three.js elements
extend(THREE);

export type FormationType = 
  // Basic 2D Shapes
  'line' | 'circle' | 'square' | 'triangle' | 'rectangle' | 'pentagon' | 'hexagon' |
  // Special Symbols & Icons
  'heart' | 'star' | 'diamond' | 'arrow' | 'cross' | 'smiley' | 'peace' | 'infinity' |
  // Indian Heritage
  'indian_flag' | 'ashoka_chakra' | 'peacock' | 'lotus' | 'elephant' | 'taj_mahal' |
  // Animals & Nature
  'butterfly' | 'bird' | 'eagle' | 'flower' | 'tree' | 'sun' | 'moon' | 'cloud' |
  // Numbers & Letters
  'number_0' | 'number_1' | 'number_2' | 'letter_a' | 'letter_i' | 'letter_love' |
  // Technology & Objects
  'airplane' | 'rocket' | 'globe' | 'phone' | 'laptop' | 'car' | 'house' |
  // Dynamic & 3D
  'spiral' | 'helix' | 'wave' | 'sphere' | 'cylinder' | 'figure8' | 'pyramid' | 'dna' |
  // Entertainment & Shows
  'fireworks' | 'christmas_tree' | 'snowflake' | 'olympic_rings' | 'crown' | 'trophy' |
  // Abstract & Artistic
  'random' | 'galaxy' | 'mandala' | 'yin_yang' | 'rose' | 'musical_note';

export type ColorMode = 'by_index' | 'by_distance' | 'by_velocity' | 'rainbow' | 'temperature' | 'indian_flag' | 'peacock' | 'fire' | 'ocean' | 'galaxy';

const Index = () => {
  const [formation, setFormation] = useState<FormationType>('indian_flag');
  const [isAnimating, setIsAnimating] = useState(false);
  const [colorMode, setColorMode] = useState<ColorMode>('indian_flag');
  const [zoomLevel, setZoomLevel] = useState(15);
  const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
  const [swarmSize, setSwarmSize] = useState(150);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [formationSize, setFormationSize] = useState(8);

  const togglePosition = () => {
    setTargetPosition(prev => 
      prev[0] === 0 ? [20, 0, 0] : [0, 0, 0]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Left Control Panel */}
      <div className="w-96 bg-slate-800/50 backdrop-blur-lg border-r border-slate-700/50 p-6 space-y-6 overflow-y-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
            🇮🇳 Advanced Drone Swarm 🇮🇳
          </h1>
          <p className="text-slate-300 text-sm">
            Interactive 3D Formation Control with Indian Heritage
          </p>
        </div>

        <FormationControls
          formation={formation}
          onFormationChange={setFormation}
          colorMode={colorMode}
          onColorModeChange={setColorMode}
        />

        <SimulationControls
          isAnimating={isAnimating}
          onToggleAnimation={setIsAnimating}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          onPositionChange={togglePosition}
          targetPosition={targetPosition}
          swarmSize={swarmSize}
          onSwarmSizeChange={setSwarmSize}
          animationSpeed={animationSpeed}
          onAnimationSpeedChange={setAnimationSpeed}
          formationSize={formationSize}
          onFormationSizeChange={setFormationSize}
        />

        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <h3 className="text-white font-semibold mb-2">🎯 Features</h3>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• 🇮🇳 Indian Heritage formations</li>
            <li>• 🦚 Animals & Nature shapes</li>
            <li>• 🚀 Technology & Vehicle forms</li>
            <li>• ✨ Dynamic 3D animations</li>
            <li>• 🎨 Multiple color themes</li>
            <li>• 📱 Responsive controls</li>
          </ul>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <h3 className="text-white font-semibold mb-2">Instructions</h3>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• Click and drag to rotate view</li>
            <li>• Scroll to zoom in/out</li>
            <li>• Select formations to see patterns</li>
            <li>• Adjust swarm size and speed</li>
            <li>• Try different color modes</li>
          </ul>
        </div>
      </div>

      {/* Main 3D Visualization */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [zoomLevel, zoomLevel, zoomLevel], fov: 60 }}
          className="bg-transparent"
        >
          <Suspense fallback={null}>
            {/* Enhanced Lighting */}
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <pointLight position={[0, 20, 0]} intensity={0.3} color="#4f46e5" />
            <pointLight position={[15, 0, 15]} intensity={0.4} color="#f59e0b" />
            
            {/* Grid */}
            <gridHelper args={[40, 40, '#444444', '#222222']} />
            
            {/* Drone Swarm */}
            <DroneSwarm
              formation={formation}
              isAnimating={isAnimating}
              colorMode={colorMode}
              targetPosition={targetPosition}
              swarmSize={swarmSize}
              animationSpeed={animationSpeed}
              formationSize={formationSize}
            />
            
            {/* Camera Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxDistance={100}
              minDistance={3}
            />
          </Suspense>
        </Canvas>

        {/* Enhanced Overlay Info */}
        <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
          <div className="text-white text-sm space-y-1">
            <div>Formation: <span className="text-blue-400 font-semibold capitalize">{formation.replace('_', ' ')}</span></div>
            <div>Drones: <span className="text-green-400 font-semibold">{swarmSize}</span></div>
            <div>Status: <span className={`font-semibold ${isAnimating ? 'text-green-400' : 'text-yellow-400'}`}>
              {isAnimating ? '✨ Animating' : '⏸️ Static'}
            </span></div>
            <div>Color: <span className="text-purple-400 font-semibold capitalize">{colorMode.replace('_', ' ')}</span></div>
            <div>Target: <span className="text-purple-400 font-mono">
              [{targetPosition.map(n => n.toFixed(1)).join(', ')}]
            </span></div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur-lg rounded-lg p-3 border border-slate-700/50">
          <div className="text-white text-xs space-y-1">
            <div>Speed: <span className="text-green-400">{animationSpeed}x</span></div>
            <div>Size: <span className="text-blue-400">{formationSize}</span></div>
            <div>Zoom: <span className="text-orange-400">{zoomLevel}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
