import { useState, useRef } from 'react';
import { Bug } from 'lucide-react';
import { PieChart, Pie, Cell, Label } from 'recharts';

interface WheelGameProps {
  options: string[];
}

export function WheelGame({ options }: WheelGameProps) {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [debugMode, setDebugMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Base colors for the wheel
  const COLORS = [
    '#EF4444', // red-500
    '#3B82F6', // blue-500
    '#10B981', // green-500
    '#F59E0B', // yellow-500
    '#8B5CF6', // purple-500
    '#EC4899', // pink-500
    '#6366F1', // indigo-500
    '#F97316'  // orange-500
  ];

  // Format data for Recharts
  const data = options.map(option => ({
    name: option,
    value: 1 // Equal segments
  }));

  // Create unique gradient IDs for each segment
  const getGradientId = (index: number) => `wheelGradient-${index}`;

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setWinner(null);

    const spins = 8 + Math.random() * 2;
    const extraAngle = Math.random() * 360;
    const totalRotation = spins * 360 + extraAngle;
    
    const finalAngle = 360 - (totalRotation % 360);
    const segmentSize = 360 / options.length;
    const winningIndex = Math.floor(finalAngle / segmentSize);
    
    setRotation(totalRotation);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    setTimeout(() => {
      setSpinning(false);
      setWinner(options[winningIndex]);
      new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3').play();
    }, 6000);
  };

  // Calculate segment midpoint for label placement
  const getLabelPosition = (index: number) => {
    const angle = ((360 / options.length) * index + (360 / options.length) / 2) * Math.PI / 180;
    return {
      x: Math.cos(angle - Math.PI / 2) * 120 + 192,
      y: Math.sin(angle - Math.PI / 2) * 120 + 192
    };
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-center items-start gap-12">
        {/* Debug Mode Toggle */}
        <button
          onClick={() => setDebugMode(!debugMode)}
          className={`fixed top-4 right-4 p-2 rounded-full ${
            debugMode ? 'bg-yellow-500' : 'bg-gray-200'
          } hover:opacity-80 transition-colors`}
          title={debugMode ? 'Disable debug mode' : 'Enable debug mode'}
        >
          <Bug className={`w-5 h-5 ${debugMode ? 'text-white' : 'text-gray-600'}`} />
        </button>

        {/* Legend */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h3 className="text-white font-semibold mb-3">Options</h3>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-white">
                  {debugMode ? `[${index}] ` : ''}{option}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wheel */}
        <div className="relative w-96 h-96">
          <div className="absolute w-full h-full">
            <div
              className="w-full h-full transition-transform"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 6s cubic-bezier(0.32, 0.94, 0.60, 1)' : 'none',
              }}
            >
              <PieChart width={384} height={384}>
                <defs>
                  {COLORS.map((color, index) => (
                    <radialGradient key={index} id={getGradientId(index)}>
                      <stop offset="0%" stopColor="#fff" stopOpacity={0.3} />
                      <stop offset="50%" stopColor={color} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                    </radialGradient>
                  ))}
                </defs>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={175}
                  stroke="white"
                  strokeWidth={2}
                >
                  {data.map((entry, index) => {
                    const pos = getLabelPosition(index);
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#${getGradientId(index % COLORS.length)})`}
                      >
                        {/* Option Labels */}
                        <text
                          x={pos.x}
                          y={pos.y}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                          }}
                          className="select-none pointer-events-none"
                        >
                          {options[index]}
                          {debugMode && (
                            <tspan x={pos.x} y={pos.y - 20} fontSize="18px">
                              [{index}]
                            </tspan>
                          )}
                        </text>
                      </Cell>
                    );
                  })}
                </Pie>
              </PieChart>
            </div>
          </div>

          {/* Center circle */}
          <div className="absolute left-1/2 top-1/2 w-16 h-16 bg-gradient-to-b from-white to-gray-100 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 border-4 border-gray-200">
            <div className="absolute inset-0 rounded-full shadow-inner" />
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-12 z-10 filter drop-shadow-lg">
            <div className="w-full h-full relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-b from-red-500 to-red-600" style={{ clipPath: 'polygon(50% 100%, 100% 0, 0 0)' }} />
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-6 bg-gradient-to-b from-red-400 to-red-500" style={{ clipPath: 'polygon(50% 100%, 100% 0, 0 0)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {debugMode && (
        <div className="text-white bg-black/30 p-4 rounded-lg space-y-1">
          <p>Number of Options: {options.length}</p>
          <p>Segment Size: {(360 / options.length).toFixed(2)}°</p>
          <p>Current Rotation: {rotation.toFixed(2)}°</p>
          <p>Final Angle: {(360 - (rotation % 360)).toFixed(2)}°</p>
          <p>Winner Index: {winner ? options.indexOf(winner) : 'None'}</p>
        </div>
      )}

      <button
        onClick={spinWheel}
        disabled={spinning}
        className={`px-8 py-4 text-xl font-bold text-white rounded-full shadow-lg ${
          spinning ? 'bg-gray-500' : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
        } transition-all`}
      >
        {spinning ? 'Spinning...' : 'Spin the Wheel!'}
      </button>

      {winner && (
        <div className="text-center animate-bounce">
          <h2 className="text-3xl font-bold text-white">
            🎉 {debugMode ? `[${options.indexOf(winner)}] ` : ''}{winner} 🎉
          </h2>
        </div>
      )}

      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3"
      />
    </div>
  );
}