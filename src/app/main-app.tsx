'use client';

import { useEffect } from 'react';
import { AppContainer } from '../components/AppContainer';
import { QuestionsAndAnswers } from '../components/QuestionsAndAnswers';
import { ControlPanel } from '../components/ControlPanel';
import { RefreshCcw } from 'lucide-react';
import { useAssessmentFlow } from '../hooks/useAssessmentFlow';
import { useProgressService } from '../hooks/useProgressService';
import CRTShell from '../components/CRTShell';

export default function MainApp() {
  const { state, navigationState, handlers } = useAssessmentFlow();
  const totalSteps = Math.max(state.totalScreens, 1);
  const progressService = useProgressService(totalSteps);
  const { currentStep, setCurrentStep, progress } = progressService;
  const progressPercent = progress;
  const useFpsBudget = state.useFpsBudget;

  const hoveredOptionLabel =
    state.hoveredOption != null &&
    state.hoveredOption > 0 &&
    state.hoveredOption <= state.currentOptions.length
      ? state.currentOptions[state.hoveredOption - 1]
      : undefined;

  useEffect(() => {
    setCurrentStep(Math.min(state.currentScreenIndex + 1, totalSteps));
  }, [state.currentScreenIndex, totalSteps, setCurrentStep]);

  const headerZone = (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-zinc-500">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>Progress</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );

  const screenZone = (
    <div className="tv-screen h-full w-full bg-black border-8 border-zinc-800 rounded-lg p-8 flex flex-col">
      {state.isTextInput ? (
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-4xl font-bold uppercase text-yellow-300 mb-8 text-center">Describe Your Scenario</h2>
          <textarea
            value={state.textValue}
            onChange={(e) => handlers.handleTextChange(e.target.value)}
            placeholder="Enter your custom scenario..."
            className="w-full h-64 rounded-lg border-2 border-zinc-700 bg-zinc-900 px-4 py-3 text-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            maxLength={500}
            autoFocus
          />
          <div className="text-sm text-zinc-500 text-right mt-2">
            {state.textValue.length}/500
          </div>
        </div>
      ) : (
        <QuestionsAndAnswers
          title={state.currentTitle}
          subtitle={state.currentSubtitle}
          industry={state.industry || ''}
          isLoading={state.isLoading}
          reportData={state.reportData}
          showTextPreview={false}
          textPreview={state.textValue}
          hoveredOptionLabel={hoveredOptionLabel}
        />
      )}
      {state.error && (
        <div className="mt-4 rounded-lg border-2 border-red-500 bg-red-900/20 px-4 py-3 text-center text-red-200" role="alert">
          {state.error}
        </div>
      )}
    </div>
  );

  const keypadZone = (
    <ControlPanel
      options={state.currentOptions}
      tempSelection={state.tempSelection}
      multiSelections={state.multiSelections}
      isMultiSelect={state.isMultiSelect}
      isTextInput={state.isTextInput}
      onSelect={handlers.handleSelection}
      onHover={handlers.handleHover}
    />
  );

  const footerZone = (
    <div className="flex items-center justify-between px-4">
      <button
        type="button"
        onClick={handlers.handleReset}
        aria-label="Reset"
        className="h-14 w-14 rounded-full bg-yellow-500 border-4 border-yellow-700 shadow-lg hover:bg-yellow-400 active:scale-95 transition-transform"
      >
        <RefreshCcw className="h-6 w-6 mx-auto text-yellow-900" />
      </button>
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={handlers.handleBack}
          disabled={navigationState.isFirstScreen}
          aria-label="Back"
          className="h-20 w-20 rounded-full bg-red-600 border-4 border-red-800 shadow-xl hover:bg-red-500 active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={state.isReport ? handlers.handleCopyReport : handlers.handleConfirm}
          disabled={!navigationState.canConfirm && !state.isReport}
          aria-label="Confirm"
          className={`h-20 w-20 rounded-full border-4 shadow-xl active:scale-95 transition-transform ${
            navigationState.canConfirm || state.isReport
              ? 'bg-emerald-500 border-emerald-700 hover:bg-emerald-400'
              : 'bg-emerald-900 border-emerald-950 opacity-30 cursor-not-allowed'
          }`}
        />
      </div>
    </div>
  );

  return (
    <AppContainer
      screen={
        <CRTShell
          headerZone={headerZone}
          screenZone={screenZone}
          keypadZone={keypadZone}
          footerZone={footerZone}
          disableMotion={!useFpsBudget}
          scanlines={useFpsBudget}
        />
      }
    />
  );
}
