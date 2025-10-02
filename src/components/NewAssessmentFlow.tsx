'use client';

import { useState, useCallback } from 'react';
import { JourneyTracker } from '../lib/journey-tracker';
import { getScreenConfig } from '../lib/screen-config-new';
import { QuestionScreen } from './screens/QuestionScreen';
import { generateQuestionsFromPrelims, generateCustomReport } from '../ai/flows/full-context-flow';
import type { FullContextOutput } from '../ai/flows/full-context-flow';

const SCREEN_ORDER = ['PRELIM_1', 'PRELIM_2', 'PRELIM_3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'];

export function NewAssessmentFlow() {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [journeyTracker] = useState(() => new JourneyTracker());
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [industry, setIndustry] = useState<string>('');
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
  const [reportData, setReportData] = useState<FullContextOutput | null>(null);

  const currentScreen = SCREEN_ORDER[currentScreenIndex];
  const config = getScreenConfig(currentScreen, industry);

  // Override config with AI-generated questions if available
  const getEffectiveConfig = () => {
    if (currentScreen.startsWith('Q') && aiQuestions.length > 0) {
      const questionIndex = parseInt(currentScreen.substring(1)) - 4; // Q4=0, Q5=1, etc.
      if (questionIndex >= 0 && questionIndex < aiQuestions.length) {
        return {
          ...config,
          title: aiQuestions[questionIndex],
          options: [
            "Strongly agree",
            "Somewhat agree", 
            "Neutral",
            "Somewhat disagree",
            "Strongly disagree"
          ]
        };
      }
    }
    return config;
  };

  const effectiveConfig = getEffectiveConfig();

  const handleSelection = useCallback(async (buttonNumber: number, buttonText: string, isMultiSelect?: boolean) => {
    if (isMultiSelect && buttonNumber > 0) {
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
      const combinedText = selectedOptions
        .map(num => effectiveConfig.options[num - 1])
        .join(', ');
      
      for (const optionNum of selectedOptions) {
        journeyTracker.addResponse(currentScreen, optionNum, effectiveConfig.options[optionNum - 1]);
      }
      
      buttonText = combinedText;
    } else {
      journeyTracker.addResponse(currentScreen, buttonNumber, buttonText);
    }

    // Store industry selection
    if (currentScreen === 'PRELIM_1') {
      setIndustry(buttonText);
    }

    setSelectedOptions([]);
    setIsLoading(true);

    try {
      // Generate AI questions after PRELIM_3
      if (currentScreen === 'PRELIM_3') {
        const result = await generateQuestionsFromPrelims(
          journeyTracker.getFullContext(currentScreen),
          industry
        );
        
        if (result.questions) {
          setAiQuestions(result.questions);
        }
      }

      // Generate report after Q8
      if (currentScreen === 'Q8') {
        const result = await generateCustomReport(
          journeyTracker.getFullContext(currentScreen),
          industry
        );
        
        setReportData(result);
      }

      // Move to next screen
      setTimeout(() => {
        setCurrentScreenIndex(prev => prev + 1);
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error('AI processing error:', error);
      setTimeout(() => {
        setCurrentScreenIndex(prev => prev + 1);
        setIsLoading(false);
      }, 1000);
    }
  }, [currentScreen, effectiveConfig, currentScreenIndex, journeyTracker, selectedOptions, industry]);

  const resetAssessment = () => {
    setCurrentScreenIndex(0);
    journeyTracker.clear();
    setSelectedOptions([]);
    setIndustry('');
    setAiQuestions([]);
    setReportData(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {currentScreen === 'PRELIM_3' ? 'Generating personalized questions...' : 
           currentScreen === 'Q8' ? 'Creating your custom report...' : 
           'Processing your response...'}
        </p>
      </div>
    );
  }

  if (currentScreenIndex >= SCREEN_ORDER.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Custom Assessment Report</h2>
          <p className="text-gray-600">Industry: {industry}</p>
        </div>
        
        {reportData && (
          <>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Executive Summary</h3>
              <p className="text-gray-800">{reportData.response}</p>
            </div>

            {reportData.reportFactors && (
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {reportData.reportFactors.map((factor, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">{factor.factor}</h4>
                    <p className="text-sm text-gray-700 mb-2">{factor.analysis}</p>
                    <p className="text-sm text-blue-700 font-medium">{factor.recommendation}</p>
                  </div>
                ))}
              </div>
            )}
          </>
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
        config={effectiveConfig}
        onSelection={handleSelection}
        selectedOptions={selectedOptions}
      />

      {industry && (
        <div className="max-w-2xl mx-auto mt-4 text-center">
          <span className="text-sm text-gray-500">Industry: {industry}</span>
        </div>
      )}
    </div>
  );
}