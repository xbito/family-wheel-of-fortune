import { useState, useEffect } from 'react';
import { Settings, List } from 'lucide-react';
import { WheelGame } from './components/WheelGame';
import { OptionsManager } from './components/OptionsManager';
import { ScenarioManager } from './components/ScenarioManager';
import { DEFAULT_SCENARIOS, type Scenario } from './types';

type ManagementMode = 'none' | 'options' | 'scenarios';

function App() {
  const [managementMode, setManagementMode] = useState<ManagementMode>('none');
  const [scenarios, setScenarios] = useState<Scenario[]>(() => {
    const saved = localStorage.getItem('wheelScenarios');
    return saved ? JSON.parse(saved) : DEFAULT_SCENARIOS;
  });
  const [currentScenarioId, setCurrentScenarioId] = useState(() => {
    const saved = localStorage.getItem('currentScenarioId');
    return saved || 'breakfast';
  });

  const currentScenario = scenarios.find(s => s.id === currentScenarioId) || scenarios[0];

  useEffect(() => {
    localStorage.setItem('wheelScenarios', JSON.stringify(scenarios));
  }, [scenarios]);

  useEffect(() => {
    localStorage.setItem('currentScenarioId', currentScenarioId);
  }, [currentScenarioId]);

  const handleUpdateScenario = (updatedScenario: Scenario) => {
    setScenarios(scenarios.map(s => 
      s.id === updatedScenario.id ? updatedScenario : s
    ));
  };

  const handleScenarioIdChange = (newId: string) => {
    setCurrentScenarioId(newId);
    setManagementMode('none');
  };

  const handleUpdateScenarios = (updatedScenarios: Scenario[]) => {
    // Find if the current scenario's ID has changed
    const currentScenario = scenarios.find(s => s.id === currentScenarioId);
    const updatedCurrentScenario = currentScenario 
      ? updatedScenarios.find(s => s.name === currentScenario.name)
      : null;

    // If we found the updated scenario and its ID changed, update currentScenarioId
    if (updatedCurrentScenario && updatedCurrentScenario.id !== currentScenarioId) {
      setCurrentScenarioId(updatedCurrentScenario.id);
    }

    setScenarios(updatedScenarios);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Family Wheel of Fortune</h1>
          <div className="flex justify-between items-center w-full">
            <select
              value={currentScenarioId}
              onChange={(e) => handleScenarioIdChange(e.target.value)}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {scenarios.map(scenario => (
                <option key={scenario.id} value={scenario.id} className="text-black">
                  {scenario.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setManagementMode(mode => mode === 'scenarios' ? 'none' : 'scenarios')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-colors ${
                  managementMode === 'scenarios' 
                    ? 'bg-purple-500 text-white hover:bg-purple-600' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
                <span>Scenarios</span>
              </button>
              <button
                onClick={() => setManagementMode(mode => mode === 'options' ? 'none' : 'options')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-colors ${
                  managementMode === 'options' 
                    ? 'bg-purple-500 text-white hover:bg-purple-600' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Options</span>
              </button>
            </div>
          </div>
        </div>

        {managementMode === 'options' ? (
          <OptionsManager 
            scenario={currentScenario}
            onUpdateScenario={handleUpdateScenario}
          />
        ) : managementMode === 'scenarios' ? (
          <ScenarioManager
            scenarios={scenarios}
            onUpdateScenarios={handleUpdateScenarios}
            onClose={() => setManagementMode('none')}
          />
        ) : (
          <WheelGame options={currentScenario.options} />
        )}
      </div>
    </div>
  );
}

export default App;