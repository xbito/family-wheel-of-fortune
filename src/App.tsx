import React, { useState, useEffect } from 'react';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { WheelGame } from './components/WheelGame';
import { OptionsManager } from './components/OptionsManager';

function App() {
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<string[]>(() => {
    const saved = localStorage.getItem('wheelOptions');
    return saved ? JSON.parse(saved) : ['Dinner', 'Game Night'];
  });

  useEffect(() => {
    localStorage.setItem('wheelOptions', JSON.stringify(options));
  }, [options]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Family Wheel of Fortune</h1>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Options</span>
          </button>
        </div>

        {showOptions ? (
          <OptionsManager options={options} setOptions={setOptions} />
        ) : (
          <WheelGame options={options} />
        )}
      </div>
    </div>
  );
}

export default App;