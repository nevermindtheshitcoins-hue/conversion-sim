'use client';

import { useCallback, useState } from 'react';
import { JourneyTracker } from '../lib/journey-tracker';
import { getScreenConfig } from '../lib/screen-config';
import type { ScreenConfig } from '../lib/screen-config';
import { QuestionScreen } from './screens/QuestionScreen';
import { submitSelectionEnhanced } from '../app/actions-enhanced';
import type { EnhancedAIInput } from '../ai/flows/enhanced-conversion-flow';

const SCREEN_ORDER = ['PRELIM_A', 'PRELIM_B', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5'];

export function AssessmentFlow() {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [journeyTracker, setJourneyTracker] = useState(() => new JourneyTracker());
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [dynamicQuestions, setDynamicQuestions] = useState<string[]>([]);
  const [dynamicScreenConfigs, setDynamicScreenConfigs] = useState<Record<string, ScreenConfig>>({});

  const currentScreen = SCREEN_ORDER[currentScreenIndex];
  const baseConfig = getScreenConfig(currentScreen);
  const config = dynamicScreenConfigs[currentScreen] || baseConfig;

  const handleSelection = useCallback(async (buttonNumber: number, buttonText: string, isMultiSelect?: boolean) => {
    if (isMultiSelect && buttonNumber > 0) {
      // Handle multi-select toggle
      setSelectedOptions(prev => {
        const isSelected = prev.includes(buttonNumber);
        if (isSelected) {
          return prev.filter(n => n !== buttonNumber);
        } else {
          return [...prev, buttonNumber];
        }
      });
      return;
    }

    // Handle continue or single selection
    if (isMultiSelect && buttonNumber === 0) {
      // Multi-select continue - combine all selections
      const combinedText = selectedOptions
        .map(num => config.options[num - 1])
        .join(', ');
      
      for (const optionNum of selectedOptions) {
        journeyTracker.addResponse(currentScreen, optionNum, config.options[optionNum - 1]);
      }
      
      buttonText = combinedText;
    } else {
      // Single selection
      journeyTracker.addResponse(currentScreen, buttonNumber, buttonText);
    }

    setIsLoading(true);
    setSelectedOptions([]);

    try {
      // Prepare enhanced AI input
      const aiInput: EnhancedAIInput = {
        currentSelection: {
          buttonNumber,
          buttonText,
          screen: currentScreen,
        },
        userJourney: journeyTracker.getFullContext(currentScreen),
        screenConfig: config,
      };

      const result = await submitSelectionEnhanced(aiInput);
      
      if (result.success && result.data) {
        setAiResponse(result.data.response);
        if (result.data.questions) {
          setDynamicQuestions(result.data.questions);
          
          // If this screen generates questions for the next screen, update it
          if (currentScreen === 'PRELIM_B') {
            const nextScreenIndex = currentScreenIndex + 2; // Skip loading screen
            const nextScreen = SCREEN_ORDER[nextScreenIndex];
            if (nextScreen) {
              setDynamicScreenConfigs(prev => ({
                ...prev,
                [nextScreen]: {
                  ...getScreenConfig(nextScreen),
                  options: result.data.questions || [],
                },
              }));
            }
          }
          
          // If Q3 generates its own questions, update current screen
          if (currentScreen === 'Q3' && 'aiGenerated' in baseConfig && baseConfig.aiGenerated) {
            setDynamicScreenConfigs(prev => ({
              ...prev,
              [currentScreen]: {
                ...baseConfig,
                options: result.data.questions || [],
              },
            }));
          }
        }
      } else {
        throw new Error(result.error || 'Unknown error');
      }

      // Move to next screen or show results
      if (currentScreenIndex < SCREEN_ORDER.length - 1) {
        setTimeout(() => {
          setCurrentScreenIndex(prev => prev + 1);
          setIsLoading(false);
        }, 1500);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('AI processing error:', error);
      setAiResponse('Thank you for your selection. Processing your assessment...');
      
      setTimeout(() => {
        if (currentScreenIndex < SCREEN_ORDER.length - 1) {
          setCurrentScreenIndex(prev => prev + 1);
        }
        setIsLoading(false);
      }, 1000);
    }
  }, [baseConfig, config, currentScreen, currentScreenIndex, journeyTracker, selectedOptions]);

  const resetAssessment = () => {
    setCurrentScreenIndex(0);
    journeyTracker.clear();
    setSelectedOptions([]);
    setAiResponse('');
    setDynamicQuestions([]);
    setDynamicScreenConfigs({});
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full size-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing your response...</p>
        {aiResponse && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-800">{aiResponse}</p>
          </div>
        )}
      </div>
    );
  }

  if (currentScreenIndex >= SCREEN_ORDER.length) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment Complete</h2>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="whitespace-pre-line text-gray-800">{aiResponse}</div>
        </div>

        {dynamicQuestions.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Follow-up Questions:</h3>
            <ul className="space-y-2">
              {dynamicQuestions.map((question, index) => (
                <li key={index} className="text-gray-700">
                  {index + 1}. {question}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={resetAssessment}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Step {currentScreenIndex + 1} of {SCREEN_ORDER.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentScreenIndex + 1) / SCREEN_ORDER.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentScreenIndex + 1) / SCREEN_ORDER.length) * 100}%` }}
          />
        </div>
      </div>

      <QuestionScreen
        config={config}
        onSelection={handleSelection}
        selectedOptions={selectedOptions}
      />

      {aiResponse && (
        <div className="max-w-2xl mx-auto mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-gray-800">{aiResponse}</p>
        </div>
      )}
    </div>
  );
}