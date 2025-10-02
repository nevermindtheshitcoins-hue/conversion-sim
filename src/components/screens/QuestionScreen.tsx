'use client';


import type { ScreenConfig } from '../../lib/screen-config-new';

interface QuestionScreenProps {
  config: ScreenConfig;
  onSelection: (buttonNumber: number, buttonText: string, isMultiSelect?: boolean) => void;
  selectedOptions?: number[];
}

export function QuestionScreen({ config, onSelection, selectedOptions = [] }: QuestionScreenProps) {
  const handleSelection = (index: number, text: string) => {
    if (config.multiSelect) {
      const isSelected = selectedOptions.includes(index + 1);
      const canSelect = selectedOptions.length < (config.maxSelections || 3);
      
      if (isSelected || canSelect) {
        onSelection(index + 1, text, true);
      }
    } else {
      onSelection(index + 1, text);
    }
  };

  const isSelected = (index: number) => selectedOptions.includes(index + 1);
  const canSelect = selectedOptions.length < (config.maxSelections || 3);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{config.title}</h2>
        {config.subtitle && (
          <p className="text-gray-600">{config.subtitle}</p>
        )}
        {config.multiSelect && (
          <p className="text-sm text-gray-500 mt-2">
            Select up to {config.maxSelections} options ({selectedOptions.length} selected)
          </p>
        )}
      </div>

      <div className="space-y-3">
        {config.options.map((option, index) => {
          const selected = isSelected(index);
          const disabled = config.multiSelect && !selected && !canSelect;
          
          return (
            <button
              key={index}
              onClick={() => handleSelection(index, option)}
              disabled={disabled}
              className={`w-full p-4 text-left h-auto whitespace-normal border rounded-lg transition-colors ${
                selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 hover:border-gray-400'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-sm font-medium mr-3">
                {index + 1}.
              </span>
              <span>{option}</span>
              {selected && config.multiSelect && (
                <span className="ml-auto">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {config.multiSelect && selectedOptions.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => onSelection(0, 'continue')}
            className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue with {selectedOptions.length} selection{selectedOptions.length > 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}