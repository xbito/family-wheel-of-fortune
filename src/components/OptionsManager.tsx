import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import type { Scenario } from '../types';

interface OptionsManagerProps {
  scenario: Scenario;
  onUpdateScenario: (updatedScenario: Scenario) => void;
}

export function OptionsManager({ scenario, onUpdateScenario }: OptionsManagerProps) {
  const [newOption, setNewOption] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const addOption = () => {
    if (newOption.trim() && scenario.options.length < 8) {
      onUpdateScenario({
        ...scenario,
        options: [...scenario.options, newOption.trim()]
      });
      setNewOption('');
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(scenario.options[index]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingText('');
  };

  const saveEditing = (index: number) => {
    if (editingText.trim() && editingText !== scenario.options[index]) {
      const newOptions = [...scenario.options];
      newOptions[index] = editingText.trim();
      onUpdateScenario({
        ...scenario,
        options: newOptions
      });
    }
    cancelEditing();
  };

  const removeOption = (index: number) => {
    onUpdateScenario({
      ...scenario,
      options: scenario.options.filter((_, i) => i !== index)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Manage {scenario.name} Options</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addOption)}
            placeholder={`Add new ${scenario.name.toLowerCase()} option`}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            maxLength={30}
          />
          <button
            onClick={addOption}
            disabled={!newOption.trim() || scenario.options.length >= 8}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {scenario.options.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, () => saveEditing(index))}
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={30}
                    autoFocus
                  />
                ) : (
                  <span>{option}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editingIndex === index ? (
                  <>
                    <button
                      onClick={() => saveEditing(index)}
                      className="p-1 text-green-500 hover:text-green-600 transition-colors"
                      title="Save changes"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-1 text-gray-500 hover:text-gray-600 transition-colors"
                      title="Cancel editing"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEditing(index)}
                    className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
                    title="Edit option"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => removeOption(index)}
                  className="p-1 text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {scenario.options.length >= 8 && (
          <p className="text-red-500 text-sm">
            Maximum number of options (8) reached
          </p>
        )}
      </div>
    </div>
  );
}