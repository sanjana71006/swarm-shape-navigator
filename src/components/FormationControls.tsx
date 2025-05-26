
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle, Square, Triangle, Heart, Star, Flag, Bird, Globe, Rocket } from 'lucide-react';
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
    // Indian Heritage
    { type: 'indian_flag', label: '🇮🇳 Indian Flag', icon: <Flag size={16} />, category: 'Indian Heritage' },
    { type: 'ashoka_chakra', label: '☸️ Ashoka Chakra', icon: <div className="w-4 h-4 border-2 border-current rounded-full relative"><div className="absolute inset-1 border border-current rounded-full"></div></div>, category: 'Indian Heritage' },
    { type: 'peacock', label: '🦚 Peacock', icon: <Bird size={16} />, category: 'Indian Heritage' },
    { type: 'lotus', label: '🪷 Lotus', icon: <div className="w-4 h-4 bg-current rounded-full relative"><div className="absolute -top-1 -left-1 w-2 h-2 bg-current rounded-full"></div></div>, category: 'Indian Heritage' },
    { type: 'elephant', label: '🐘 Elephant', icon: <div className="w-4 h-3 bg-current rounded-t-full relative"><div className="absolute bottom-0 left-1/2 w-1 h-2 bg-current transform -translate-x-1/2"></div></div>, category: 'Indian Heritage' },
    { type: 'taj_mahal', label: '🕌 Taj Mahal', icon: <div className="w-4 h-4 bg-current relative"><div className="absolute top-0 left-1/2 w-2 h-2 bg-current rounded-full transform -translate-x-1/2 -translate-y-1/2"></div></div>, category: 'Indian Heritage' },

    // Basic 2D Shapes
    { type: 'line', label: 'Line', icon: <div className="w-4 h-1 bg-current" />, category: 'Basic 2D' },
    { type: 'circle', label: 'Circle', icon: <Circle size={16} />, category: 'Basic 2D' },
    { type: 'square', label: 'Square', icon: <Square size={16} />, category: 'Basic 2D' },
    { type: 'triangle', label: 'Triangle', icon: <Triangle size={16} />, category: 'Basic 2D' },
    { type: 'rectangle', label: 'Rectangle', icon: <div className="w-4 h-3 bg-current" />, category: 'Basic 2D' },
    { type: 'pentagon', label: 'Pentagon', icon: <div className="w-4 h-4 bg-current" style={{clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'}} />, category: 'Basic 2D' },
    { type: 'hexagon', label: 'Hexagon', icon: <div className="w-4 h-4 bg-current" style={{clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'}} />, category: 'Basic 2D' },

    // Special Symbols
    { type: 'heart', label: '❤️ Heart', icon: <Heart size={16} />, category: 'Symbols' },
    { type: 'star', label: '⭐ Star', icon: <Star size={16} />, category: 'Symbols' },
    { type: 'diamond', label: '💎 Diamond', icon: <div className="w-3 h-3 bg-current transform rotate-45" />, category: 'Symbols' },
    { type: 'cross', label: '✝️ Cross', icon: <div className="w-4 h-4 bg-current" style={{clipPath: 'polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)'}} />, category: 'Symbols' },
    { type: 'smiley', label: '😊 Smiley', icon: <div className="w-4 h-4 bg-current rounded-full relative"><div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div><div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></div></div>, category: 'Symbols' },
    { type: 'peace', label: '☮️ Peace', icon: <div className="w-4 h-4 border-2 border-current rounded-full relative"><div className="absolute inset-0 flex items-center justify-center"><div className="w-3 h-0.5 bg-current"></div></div></div>, category: 'Symbols' },
    { type: 'infinity', label: '∞ Infinity', icon: <div className="w-4 h-2 bg-current" style={{clipPath: 'path("M0 50 Q25 0 50 50 Q75 100 100 50 Q75 0 50 50 Q25 100 0 50")'}} />, category: 'Symbols' },
    { type: 'yin_yang', label: '☯️ Yin Yang', icon: <div className="w-4 h-4 bg-current rounded-full relative overflow-hidden"><div className="absolute top-0 right-0 w-2 h-4 bg-white"></div></div>, category: 'Symbols' },

    // Animals & Nature
    { type: 'butterfly', label: '🦋 Butterfly', icon: <div className="w-4 h-3 bg-current relative"><div className="absolute top-0 left-0 w-2 h-2 bg-current rounded-full"></div><div className="absolute top-0 right-0 w-2 h-2 bg-current rounded-full"></div></div>, category: 'Animals & Nature' },
    { type: 'bird', label: '🐦 Bird', icon: <Bird size={16} />, category: 'Animals & Nature' },
    { type: 'eagle', label: '🦅 Eagle', icon: <div className="w-4 h-3 bg-current" style={{clipPath: 'polygon(50% 0%, 0% 100%, 25% 75%, 50% 85%, 75% 75%, 100% 100%)'}} />, category: 'Animals & Nature' },
    { type: 'flower', label: '🌸 Flower', icon: <div className="w-4 h-4 bg-current rounded-full relative"><div className="absolute top-0 left-1/2 w-2 h-2 bg-current rounded-full transform -translate-x-1/2 -translate-y-1/2"></div></div>, category: 'Animals & Nature' },
    { type: 'tree', label: '🌳 Tree', icon: <div className="w-4 h-4 bg-current relative"><div className="absolute bottom-0 left-1/2 w-1 h-2 bg-current transform -translate-x-1/2"></div><div className="absolute top-0 left-1/2 w-3 h-3 bg-current rounded-full transform -translate-x-1/2"></div></div>, category: 'Animals & Nature' },
    { type: 'sun', label: '☀️ Sun', icon: <div className="w-4 h-4 bg-current rounded-full relative"><div className="absolute -top-1 left-1/2 w-0.5 h-1 bg-current transform -translate-x-1/2"></div></div>, category: 'Animals & Nature' },
    { type: 'moon', label: '🌙 Moon', icon: <div className="w-4 h-4 bg-current rounded-full relative overflow-hidden"><div className="absolute top-0 right-0 w-3 h-4 bg-slate-800 rounded-full"></div></div>, category: 'Animals & Nature' },
    { type: 'cloud', label: '☁️ Cloud', icon: <div className="w-4 h-3 bg-current rounded-full relative"><div className="absolute top-0 left-1 w-2 h-2 bg-current rounded-full"></div></div>, category: 'Animals & Nature' },
    { type: 'rose', label: '🌹 Rose', icon: <div className="w-4 h-4 bg-current rounded-full relative"><div className="absolute inset-1 bg-current rounded-full"></div></div>, category: 'Animals & Nature' },

    // Numbers & Letters  
    { type: 'number_0', label: '0', icon: <div className="w-3 h-4 border-2 border-current rounded-full" />, category: 'Numbers & Letters' },
    { type: 'number_1', label: '1', icon: <div className="w-1 h-4 bg-current" />, category: 'Numbers & Letters' },
    { type: 'number_2', label: '2', icon: <div className="w-3 h-4 bg-current" style={{clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%, 0 100%, 100% 100%, 100% 75%, 25% 75%, 25% 25%, 75% 25%, 75% 0)'}} />, category: 'Numbers & Letters' },
    { type: 'letter_a', label: 'A', icon: <div className="w-3 h-4 bg-current" style={{clipPath: 'polygon(50% 0%, 0% 100%, 25% 100%, 35% 70%, 65% 70%, 75% 100%, 100% 100%)'}} />, category: 'Numbers & Letters' },
    { type: 'letter_i', label: 'I', icon: <div className="w-3 h-4 bg-current relative"><div className="w-full h-1 bg-current absolute top-0"></div><div className="w-1 h-2 bg-current absolute top-1 left-1/2 transform -translate-x-1/2"></div><div className="w-full h-1 bg-current absolute bottom-0"></div></div>, category: 'Numbers & Letters' },
    { type: 'letter_love', label: 'LOVE', icon: <Heart size={16} />, category: 'Numbers & Letters' },

    // Technology & Objects
    { type: 'airplane', label: '✈️ Airplane', icon: <div className="w-4 h-4 bg-current" style={{clipPath: 'polygon(50% 0%, 45% 25%, 10% 25%, 15% 40%, 40% 40%, 35% 70%, 20% 70%, 25% 85%, 45% 85%, 50% 100%, 55% 85%, 75% 85%, 80% 70%, 65% 70%, 60% 40%, 85% 40%, 90% 25%, 55% 25%)'}} />, category: 'Technology' },
    { type: 'rocket', label: '🚀 Rocket', icon: <Rocket size={16} />, category: 'Technology' },
    { type: 'globe', label: '🌍 Globe', icon: <Globe size={16} />, category: 'Technology' },
    { type: 'phone', label: '📱 Phone', icon: <div className="w-2 h-4 bg-current rounded-sm" />, category: 'Technology' },
    { type: 'laptop', label: '💻 Laptop', icon: <div className="w-4 h-3 bg-current relative"><div className="absolute bottom-0 left-0 w-full h-1 bg-current"></div></div>, category: 'Technology' },
    { type: 'car', label: '🚗 Car', icon: <div className="w-4 h-2 bg-current rounded relative"><div className="absolute bottom-0 left-1 w-1 h-1 bg-white rounded-full"></div><div className="absolute bottom-0 right-1 w-1 h-1 bg-white rounded-full"></div></div>, category: 'Technology' },
    { type: 'house', label: '🏠 House', icon: <div className="w-4 h-4 bg-current relative"><div className="absolute top-0 left-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-current transform -translate-x-1/2"></div></div>, category: 'Technology' },

    // Dynamic & 3D
    { type: 'spiral', label: '🌀 Spiral', icon: <div className="w-4 h-4 bg-current rounded-full" style={{background: 'conic-gradient(from 0deg, currentColor 0%, transparent 50%, currentColor 100%)'}} />, category: 'Dynamic & 3D' },
    { type: 'helix', label: '🧬 Helix', icon: <div className="w-4 h-4 relative"><div className="absolute inset-0 bg-current rounded-full opacity-60"></div><div className="absolute inset-1 bg-current rounded-full opacity-80"></div></div>, category: 'Dynamic & 3D' },
    { type: 'wave', label: '🌊 Wave', icon: <div className="w-4 h-2 bg-current" style={{clipPath: 'polygon(0% 50%, 25% 0%, 50% 50%, 75% 100%, 100% 50%, 100% 100%, 0% 100%)'}} />, category: 'Dynamic & 3D' },
    { type: 'sphere', label: '🔮 Sphere', icon: <div className="w-4 h-4 bg-current rounded-full border-2 border-white/30" />, category: 'Dynamic & 3D' },
    { type: 'cylinder', label: '🗂️ Cylinder', icon: <div className="w-4 h-4 bg-current rounded-t-full border-2 border-white/30" />, category: 'Dynamic & 3D' },
    { type: 'pyramid', label: '🔺 Pyramid', icon: <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-current" />, category: 'Dynamic & 3D' },
    { type: 'figure8', label: '♾️ Figure 8', icon: <div className="w-4 h-4 bg-current" style={{clipPath: 'path("M2,6 C2,3 4,1 7,1 C10,1 12,3 12,6 C12,9 10,11 7,11 C10,11 12,13 12,16 C12,19 10,21 7,21 C4,21 2,19 2,16 C2,13 4,11 7,11 C4,11 2,9 2,6 Z")'}} />, category: 'Dynamic & 3D' },
    { type: 'dna', label: '🧬 DNA', icon: <div className="w-4 h-4 relative"><div className="absolute left-0 top-0 w-1 h-full bg-current"></div><div className="absolute right-0 top-0 w-1 h-full bg-current"></div><div className="absolute top-1 left-1 right-1 h-0.5 bg-current"></div></div>, category: 'Dynamic & 3D' },

    // Entertainment & Shows
    { type: 'fireworks', label: '🎆 Fireworks', icon: <div className="w-4 h-4 relative"><div className="absolute inset-0 bg-current rounded-full"></div><div className="absolute -top-1 left-1/2 w-0.5 h-2 bg-current transform -translate-x-1/2"></div></div>, category: 'Entertainment' },
    { type: 'christmas_tree', label: '🎄 Christmas Tree', icon: <div className="w-4 h-4 bg-current" style={{clipPath: 'polygon(50% 0%, 25% 30%, 75% 30%, 30% 50%, 70% 50%, 35% 70%, 65% 70%, 40% 100%, 60% 100%)'}} />, category: 'Entertainment' },
    { type: 'snowflake', label: '❄️ Snowflake', icon: <div className="w-4 h-4 relative"><div className="absolute top-1/2 left-0 right-0 h-0.5 bg-current"></div><div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-current"></div></div>, category: 'Entertainment' },
    { type: 'olympic_rings', label: '🏅 Olympic Rings', icon: <div className="w-4 h-3 relative"><div className="absolute top-0 left-0 w-2 h-2 border border-current rounded-full"></div><div className="absolute top-0 right-0 w-2 h-2 border border-current rounded-full"></div></div>, category: 'Entertainment' },
    { type: 'crown', label: '👑 Crown', icon: <div className="w-4 h-3 bg-current" style={{clipPath: 'polygon(0% 100%, 0% 40%, 20% 0%, 40% 40%, 60% 0%, 80% 40%, 100% 0%, 100% 100%)'}} />, category: 'Entertainment' },
    { type: 'trophy', label: '🏆 Trophy', icon: <div className="w-3 h-4 bg-current relative"><div className="absolute top-0 left-1/2 w-2 h-2 bg-current rounded-t-full transform -translate-x-1/2"></div><div className="absolute bottom-0 left-0 w-full h-1 bg-current"></div></div>, category: 'Entertainment' },
    { type: 'musical_note', label: '🎵 Musical Note', icon: <div className="w-2 h-4 relative"><div className="absolute bottom-0 left-0 w-2 h-2 bg-current rounded-full"></div><div className="absolute top-0 right-0 w-0.5 h-3 bg-current"></div></div>, category: 'Entertainment' },

    // Abstract & Artistic
    { type: 'galaxy', label: '🌌 Galaxy', icon: <div className="w-4 h-4 bg-current rounded-full relative"><div className="absolute inset-1 bg-current rounded-full opacity-70"></div></div>, category: 'Abstract' },
    { type: 'mandala', label: '🕸️ Mandala', icon: <div className="w-4 h-4 border-2 border-current rounded-full relative"><div className="absolute inset-1 border border-current rounded-full"></div></div>, category: 'Abstract' },
    { type: 'arrow', label: '➡️ Arrow', icon: <div className="w-4 h-4 bg-current" style={{clipPath: 'polygon(40% 0%, 40% 20%, 100% 20%, 100% 30%, 40% 30%, 40% 50%, 0% 25%)'}} />, category: 'Abstract' },
    { type: 'random', label: '🎲 Random', icon: <div className="w-4 h-4 grid grid-cols-2 gap-0.5"><div className="w-1 h-1 bg-current rounded-full"></div><div className="w-1 h-1 bg-current rounded-full"></div><div className="w-1 h-1 bg-current rounded-full"></div><div className="w-1 h-1 bg-current rounded-full"></div></div>, category: 'Abstract' },
  ];

  const colorModes = [
    { mode: 'indian_flag' as ColorMode, label: '🇮🇳 Indian Flag' },
    { mode: 'peacock' as ColorMode, label: '🦚 Peacock' },
    { mode: 'by_index' as ColorMode, label: '📊 By Index' },
    { mode: 'by_distance' as ColorMode, label: '📏 By Distance' },
    { mode: 'by_velocity' as ColorMode, label: '⚡ By Velocity' },
    { mode: 'rainbow' as ColorMode, label: '🌈 Rainbow' },
    { mode: 'temperature' as ColorMode, label: '🌡️ Temperature' },
    { mode: 'fire' as ColorMode, label: '🔥 Fire' },
    { mode: 'ocean' as ColorMode, label: '🌊 Ocean' },
    { mode: 'galaxy' as ColorMode, label: '🌌 Galaxy' },
  ];

  const categories = ['Indian Heritage', 'Basic 2D', 'Symbols', 'Animals & Nature', 'Numbers & Letters', 'Technology', 'Dynamic & 3D', 'Entertainment', 'Abstract'];

  return (
    <div className="space-y-4">
      <Card className="bg-slate-700/30 border-slate-600/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">🎯 Formation Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {categories.map(category => {
            const categoryFormations = formations.filter(f => f.category === category);
            return (
              <div key={category} className="space-y-2">
                <h4 className="text-slate-300 text-sm font-medium border-b border-slate-600 pb-1">{category}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {categoryFormations.map(({ type, label, icon }) => (
                    <Button
                      key={type}
                      variant={formation === type ? "default" : "outline"}
                      className={`justify-start gap-2 text-xs h-8 ${
                        formation === type
                          ? 'bg-gradient-to-r from-orange-500 via-white to-green-500 text-black border-orange-500 font-semibold'
                          : 'bg-slate-600/30 hover:bg-slate-600/50 text-slate-200 border-slate-500/50 hover:border-orange-400'
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
          <CardTitle className="text-white text-lg">🎨 Color Themes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {colorModes.map(({ mode, label }) => (
            <Button
              key={mode}
              variant={colorMode === mode ? "default" : "outline"}
              className={`w-full text-xs ${
                colorMode === mode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 font-semibold'
                  : 'bg-slate-600/30 hover:bg-slate-600/50 text-slate-200 border-slate-500/50 hover:border-purple-400'
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
