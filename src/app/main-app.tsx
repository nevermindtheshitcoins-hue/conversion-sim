'use client';

import { useMemo, useState, useCallback } from 'react';
import { AppContainer } from '../components/AppContainer';
import { ControlPanel } from '../components/ControlPanel';
import { ZonedScreen } from '../components/ZonedScreen';
import { HeaderZone as ProgressIndicator } from '../components/zones/HeaderZone';
import { ArrowLeft, Check, Clipboard, RefreshCcw } from 'lucide-react';
import { DeVOTELogo } from '../components/DeVOTELogo';
import { useAssessmentFlow } from '../hooks/useAssessmentFlow';
import { BUTTON_STYLES, FOCUS_STYLES } from '../lib/ui-constants';

export default function MainApp() {
  const [completionCount, setCompletionCount] = useState(0);
  const handleQuestionComplete = useCallback(() => {
    setCompletionCount((prev) => prev + 1);
  }, []);

  const { state, navigationState, handlers } = useAssessmentFlow(handleQuestionComplete);
  const totalSteps = Math.max(state.totalScreens, 1);
  const currentStep = Math.min(state.currentScreenIndex + 1, totalSteps);
  const progress = (currentStep / totalSteps) * 100;
  const motionEnabled = state.motionEnabled;

  const hoveredOptionLabel = useMemo(
    () =>
      state.hoveredOption != null &&
      state.hoveredOption > 0 &&
      state.hoveredOption <= state.currentOptions.length
        ? state.currentOptions[state.hoveredOption - 1]
        : undefined,
    [state.hoveredOption, state.currentOptions]
  );

  const headerStatus = useMemo(
    () => (state.isReport ? 'complete' : state.isLoading ? 'loading' : 'active'),
    [state.isReport, state.isLoading]
  );

  const keypadZone = useMemo(
    () => {
      return (
        <div className="flex h-full flex-col gap-2">
          <div className="relative">
            <ControlPanel
              options={state.currentOptions}
              tempSelection={state.tempSelection}
              multiSelections={state.multiSelections}
              isMultiSelect={state.isMultiSelect}
              isTextInput={state.isTextInput}
              onSelect={handlers.handleSelection}
              onHover={handlers.handleHover}
            />
            {motionEnabled && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-2 w-2 rounded-full bg-emerald-400/90 shadow-[0_0_12px_rgba(16,185,129,0.7)]"
                    style={{
                      animation: `flow-top-right 6s ease-in-out infinite`,
                      animationDelay: `${i * 3}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      );
    },
    [
      state.isTextInput,
      state.isMultiSelect,
      hoveredOptionLabel,
      state.currentOptions,
      state.tempSelection,
      state.multiSelections,
      handlers.handleSelection,
      handlers.handleHover,
      motionEnabled,
    ]
  );

  const footerZone = useMemo(
    () => (
      <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
        <button
          type="button"
          onClick={handlers.handleReset}
          aria-label="Reset assessment"
          className={`flex h-14 w-14 items-center justify-center ${BUTTON_STYLES.base} ${BUTTON_STYLES.accent} ${FOCUS_STYLES.ring}`}
        >
          <RefreshCcw className="h-6 w-6 text-yellow-900" />
        </button>
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handlers.handleBack}
            disabled={navigationState.isFirstScreen}
            aria-label="Go back to previous step"
            className={`flex h-14 w-20 items-center justify-center md:h-16 md:w-24 ${BUTTON_STYLES.base} ${BUTTON_STYLES.secondary} ${FOCUS_STYLES.ring} ${
              navigationState.isFirstScreen ? BUTTON_STYLES.secondaryDisabled : ''
            }`}
          >
            <ArrowLeft className="h-7 w-7 text-zinc-100" />
          </button>
          <button
            type="button"
            onClick={state.isReport ? handlers.handleCopyReport : handlers.handleConfirm}
            disabled={!navigationState.canConfirm && !state.isReport}
            aria-label={state.isReport ? 'Copy report to clipboard' : 'Confirm selection and continue'}
            className={`flex h-14 w-20 items-center justify-center md:h-16 md:w-24 ${BUTTON_STYLES.base} ${FOCUS_STYLES.ring} matrix-glow ${
              navigationState.canConfirm || state.isReport
                ? `${BUTTON_STYLES.primary} shadow-matrix-soft hover:shadow-matrix-strong`
                : BUTTON_STYLES.primaryDisabled
            }`}
          >
            <DeVOTELogo
              className="text-matrix-green hover:text-matrix-green h-7 w-7"
              size={28}
            />
          </button>
        </div>
      </div>
    ),
    [
      handlers.handleReset,
      handlers.handleBack,
      handlers.handleCopyReport,
      handlers.handleConfirm,
      navigationState.isFirstScreen,
      navigationState.canConfirm,
      state.isReport,
    ]
  );

  const screenZone = useMemo(
    () => (
      <ZonedScreen
        contentType={state.contentType}
        title={state.currentTitle}
        subtitle={state.currentSubtitle}
        industry={state.industry}
        options={state.currentOptions}
        isLoading={state.isLoading}
        reportData={state.reportData}
        textValue={state.textValue}
        error={state.error}
        aiGenerated={state.aiGenerated}
        onRetryAiQuestions={handlers.handleRetryAiQuestions}
        onTextChange={handlers.handleTextChange}
        disableAnimations={!motionEnabled}
      />
    ),
    [
      state.contentType,
      state.currentTitle,
      state.currentSubtitle,
      state.industry,
      state.currentOptions,
      state.isLoading,
      state.reportData,
      state.textValue,
      state.error,
      state.aiGenerated,
      handlers.handleTextChange,
      handlers.handleRetryAiQuestions,
      motionEnabled,
    ]
  );

  // Debug logging to validate prop types
  console.log('MainApp -> AppContainer props:', {
    completionCount: typeof completionCount,
    currentStep: typeof currentStep,
    totalSteps: typeof totalSteps,
    status: typeof headerStatus,
    headerStatus
  });

  return (
    <AppContainer
      headerZone={null}
      screenZone={screenZone}
      keypadZone={keypadZone}
      footerZone={footerZone}
      disableMotion={!motionEnabled}
      scanlines={motionEnabled}
      completionCount={completionCount}
      currentStep={currentStep}
      totalSteps={totalSteps}
      status={headerStatus}
    />
  );
}
