import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface OptionsManagerProps {
  options: string[];
  setOptions: (options: string[]) => void;
}

export function OptionsManager({ options, setOptions }: OptionsManagerProps) {
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (newOption.trim() && options.length < 8) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addOption();
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Manage Bathroom Options</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new bathroom option"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            maxLength={30}
          />
          <button
            onClick={addOption}
            disabled={!newOption.trim() || options.length >= 8}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span>{option}</span>
              <button
                onClick={() => removeOption(index)}
                className="p-1 text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {options.length >= 8 && (
          <p className="text-red-500 text-sm">
            Maximum number of options (8) reached
          </p>
        )}
      </div>
    </div>
  );
}