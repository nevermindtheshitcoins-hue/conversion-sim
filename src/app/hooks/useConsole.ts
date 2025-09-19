'use client';

import {useState} from 'react';
import {submitSelection} from '@/app/actions';
import type {ActionResult} from '@/app/actions';
import type {GreenEggsFlowOutput} from '@/ai/flows/green-eggs-flow';

export interface Screen {
  id: string;
  content: string;
  type: 'QUESTION' | 'LOADING' | 'REPORT';
  apiCall?: boolean;
}

const initialScreenFlow: Screen[] = [
  {id: 'INIT', content: 'Select Domain', type: 'QUESTION'},
  {id: 'PRELIM_A', content: 'Select Use Case', type: 'QUESTION'},
  {id: 'PRELIM_B', content: 'Select Pain Points', type: 'QUESTION', apiCall: true},
  {id: 'LOADING_QUESTIONS', content: 'Generating Questions...', type: 'LOADING'},
  {id: 'Q1', content: 'Question 1', type: 'QUESTION'},
  {id: 'Q2', content: 'Question 2', type: 'QUESTION'},
  {id: 'Q3', content: 'Question 3', type: 'QUESTION'},
  {id: 'Q4', content: 'Question 4', type: 'QUESTION'},
  {id: 'Q5', content: 'Question 5', type: 'QUESTION', apiCall: true},
  {id: 'LOADING_REPORT', content: 'Generating Report...', type: 'LOADING'},
  {id: 'REPORT', content: '', type: 'REPORT'},
];

const domains = ['Sneetch', 'Thneed', 'Zax', 'Yop', 'Glunk'];

export function useConsole() {
  const [screenFlow, setScreenFlow] = useState(initialScreenFlow);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [selections, setSelections] = useState<(number | null)[]>(new Array(screenFlow.length).fill(null));
  const [tempSelection, setTempSelection] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentScreen = screenFlow[currentScreenIndex];

  const handleSelection = (selection: number) => {
    setTempSelection(selection);
  };

  const handleConfirm = async () => {
    if (tempSelection === null && currentScreen.type === 'QUESTION') return;

    const newSelections = [...selections];
    newSelections[currentScreenIndex] = tempSelection;
    setSelections(newSelections);
    setTempSelection(null);
    setError(null);

    if (currentScreen.apiCall) {
      setIsLoading(true);
      const nextScreenIndex = currentScreenIndex + 1;
      if (nextScreenIndex < screenFlow.length) {
        setCurrentScreenIndex(nextScreenIndex);
      }

      const result: ActionResult<GreenEggsFlowOutput> = await submitSelection(
        tempSelection!,
        `Screen: ${currentScreen.id}`
      );

      setIsLoading(false);

      if (result?.success) {
        const newFlow = [...screenFlow];
        if (result.data.questions && currentScreen.id === 'PRELIM_B') {
          result.data.questions.forEach((q, i) => {
            const screenIndex = newFlow.findIndex(s => s.id === `Q${i + 1}`);
            if (screenIndex !== -1) {
              newFlow[screenIndex].content = q;
            }
          });
        }

        const reportScreenIndex = newFlow.findIndex(s => s.id === 'REPORT');
        if (currentScreen.id === 'Q5' && reportScreenIndex !== -1) {
          newFlow[reportScreenIndex].content = result.data.response;
        }

        setScreenFlow(newFlow);

        const nextContentScreenIndex = currentScreenIndex + 2;
        if (nextContentScreenIndex < newFlow.length) {
          setCurrentScreenIndex(nextContentScreenIndex);
        }
      } else {
        setError(result?.error || 'An unexpected error occurred.');
        setCurrentScreenIndex(currentScreenIndex);
      }
      return;
    }

    if (currentScreen.type === 'REPORT') {
      navigator.clipboard.writeText(currentScreen.content);
      alert('Report copied to clipboard!');
      return;
    }

    if (currentScreenIndex < screenFlow.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (tempSelection !== null) {
      setTempSelection(null);
      return;
    }
    if (currentScreenIndex > 0) {
      const newSelections = [...selections];
      newSelections[currentScreenIndex] = null;
      setSelections(newSelections);

      let backScreenIndex = currentScreenIndex - 1;
      if (screenFlow[backScreenIndex]?.type === 'LOADING') {
        backScreenIndex = Math.max(0, currentScreenIndex - 2);
      }
      setCurrentScreenIndex(backScreenIndex);
    }
  };

  return {
    currentScreen,
    domains,
    tempSelection,
    isLoading,
    error,
    handleSelection,
    handleConfirm,
    handleBack,
  };
}
