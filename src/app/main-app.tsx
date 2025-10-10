'use client';

import { useEffect } from 'react';
import { AppContainer } from '../components/AppContainer';
import { ControlPanel } from '../components/ControlPanel';
import { ZonedScreen } from '../components/ZonedScreen';
import { RefreshCcw } from 'lucide-react';
import { useAssessmentFlow } from '../hooks/useAssessmentFlow';
import { useProgressService } from '../hooks/useProgressService';
import { ContentType } from '../types/app-state';
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

  // Determine status for header
  const headerStatus = state.isReport 
    ? 'complete' 
    : state.isLoading 
    ? 'loading' 
    : 'active';

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

  const screen = (
    <CRTShell
      headerZone={<div />} // Empty for now - will be handled by ZonedScreen
      screenZone={
        <ZonedScreen
          currentStep={currentStep}
          totalSteps={totalSteps}
          progressPercent={progressPercent}
          status={headerStatus}
          contentType={state.contentType || ContentType.SINGLE_CHOICE}
          title={state.currentTitle}
          subtitle={state.currentSubtitle}
          industry={state.industry}
          options={state.currentOptions}
          isLoading={state.isLoading}
          reportData={state.reportData}
          textValue={state.textValue}
          error={state.error}
          hoveredText={hoveredOptionLabel}
          disableAnimations={!useFpsBudget}
        />
      }
      keypadZone={keypadZone}
      footerZone={footerZone}
      disableMotion={!useFpsBudget}
      scanlines={useFpsBudget}
    />
  );

  return (
    <AppContainer
      screen={screen}
    />
  );
}
