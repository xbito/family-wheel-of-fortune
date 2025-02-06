import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Scenario } from '../types';

interface ScenarioManagerProps {
  scenarios: Scenario[];
  onUpdateScenarios: (scenarios: Scenario[]) => void;
  onClose: () => void;
}

export function ScenarioManager({ scenarios, onUpdateScenarios, onClose }: ScenarioManagerProps) {
  const [newScenarioName, setNewScenarioName] = useState('');
  
  const addScenario = () => {
    if (newScenarioName.trim()) {
      const id = newScenarioName.toLowerCase().replace(/\s+/g, '-');
      
      // Check if ID already exists
      if (scenarios.some(s => s.id === id)) {
        alert('A scenario with this name already exists');
        return;
      }
      
      const newScenario: Scenario = {
        id,
        name: newScenarioName.trim(),
        options: []
      };
      
      onUpdateScenarios([...scenarios, newScenario]);
      setNewScenarioName('');
    }
  };
  
  const removeScenario = (id: string) => {
    onUpdateScenarios(scenarios.filter(s => s.id !== id));
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addScenario();
    }
  };
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Scenarios</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newScenarioName}
            onChange={(e) => setNewScenarioName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new scenario (e.g., Lunch Choice)"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            maxLength={30}
          />
          <button
            onClick={addScenario}
            disabled={!newScenarioName.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>

        <div className="space-y-2 mt-4">
          {scenarios.map(scenario => (
            <div
              key={scenario.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <span className="font-medium">{scenario.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({scenario.options.length} options)
                </span>
              </div>
              <button
                onClick={() => removeScenario(scenario.id)}
                className="p-1 text-red-500 hover:text-red-600 transition-colors"
                disabled={scenarios.length <= 1}
                title={scenarios.length <= 1 ? "Can't delete the last scenario" : "Delete scenario"}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}