import React, { useState, useRef } from 'react';

interface WheelGameProps {
  options: string[];
}

export function WheelGame({ options }: WheelGameProps) {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create alternating pattern: option1, option2, option3, option1, option2, option3, etc.
  const expandedOptions = Array.from({ length: 3 }, () => options).flat();

  const spinWheel = () => {
    if (spinning) return;
    
    setSpinning(true);
    setWinner(null);
    
    // Increased number of spins (15-20 full rotations) plus random angle
    const spins = 15 + Math.random() * 5;
    const extraAngle = Math.random() * 360;
    const totalRotation = spins * 360 + extraAngle;
    
    // Calculate winner based on final position
    const winningIndex = Math.floor((360 - (totalRotation % 360)) / (360 / expandedOptions.length));
    
    setRotation(totalRotation);

    // Play spin sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    // Increased spin duration to 8 seconds
    setTimeout(() => {
      setSpinning(false);
      setWinner(expandedOptions[winningIndex]);
      // Play victory sound
      new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3').play();
    }, 8000);
  };

  const getSegmentColor = (index: number) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ];
    // Use the original option index to get consistent colors
    const originalIndex = index % options.length;
    return colors[originalIndex];
  };

  const getLegendColor = (index: number) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ];
    return colors[index];
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-12 items-start">
        {/* Legend */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h3 className="text-white font-semibold mb-3">Options</h3>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${getLegendColor(index)}`} />
                <span className="text-white">{option}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wheel */}
        <div className="relative w-96 h-96">
          {/* Wheel Container with shadow and border */}
          <div className="absolute w-full h-full rounded-full shadow-[0_0_25px_rgba(0,0,0,0.3)] border-8 border-gray-200 overflow-hidden">
            {/* Spinning Wheel */}
            <div
              className="absolute w-full h-full rounded-full"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 8s cubic-bezier(0.32, 0.94, 0.60, 1)' : 'none',
              }}
            >
              {expandedOptions.map((_, index) => {
                const rotation = (360 / expandedOptions.length) * index;
                return (
                  <div
                    key={index}
                    className={`absolute w-full h-full ${getSegmentColor(index)} origin-center`}
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.tan(Math.PI / expandedOptions.length)}% 0)`,
                    }}
                  >
                    {/* Segment divider lines */}
                    <div className="absolute left-1/2 h-1/2 border-r border-white transform -translate-x-1/2" />
                  </div>
                );
              })}
              
              {/* Center circle */}
              <div className="absolute left-1/2 top-1/2 w-12 h-12 bg-white rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 border-4 border-gray-200">
                <div className="absolute inset-0 rounded-full shadow-inner" />
              </div>
            </div>
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-12 z-10">
            <div className="w-full h-full relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-8 bg-red-600 transform -translate-x-1/2" style={{ clipPath: 'polygon(50% 100%, 100% 0, 0 0)' }} />
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-6 bg-red-400 transform -translate-x-1/2" style={{ clipPath: 'polygon(50% 100%, 100% 0, 0 0)' }} />
            </div>
          </div>
        </div>
      </div>

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
            🎉 {winner} 🎉
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