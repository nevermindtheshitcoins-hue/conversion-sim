'use client';

import { useMemo } from 'react';
import { AppContainer } from '../components/AppContainer';
import { ControlPanel } from '../components/ControlPanel';
import { ZonedScreen } from '../components/ZonedScreen';
import { HeaderZone as ProgressIndicator } from '../components/zones/HeaderZone';
import { ArrowLeft, Check, Clipboard, RefreshCcw } from 'lucide-react';
import { useAssessmentFlow } from '../hooks/useAssessmentFlow';
import { BUTTON_STYLES, FOCUS_STYLES } from '../lib/ui-constants';

export default function MainApp() {
  const { state, navigationState, handlers } = useAssessmentFlow();
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
        
        {/* Progress indicator in footer - larger */}
        <div className="flex-1 flex justify-center px-4">
          <div className="scale-125">
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
              progress={progress}
              status={headerStatus}
              disableAnimations={!motionEnabled}
            />
          </div>
        </div>
        
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
            className={`flex h-14 w-20 items-center justify-center md:h-16 md:w-24 ${BUTTON_STYLES.base} ${FOCUS_STYLES.ring} ${
              navigationState.canConfirm || state.isReport
                ? BUTTON_STYLES.primary
                : BUTTON_STYLES.primaryDisabled
            }`}
          >
            {state.isReport ? (
              <Clipboard className="h-6 w-6 text-emerald-100" />
            ) : (
              <Check className="h-7 w-7 text-emerald-100" />
            )}
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

  const headerZone = useMemo(
    () => (
      <div className="flex flex-col items-center gap-1 text-center">
        {/* Arcade-style engraved placard - full width */}
        <div className="relative w-full max-w-none">
          {/* Outer bezel with realistic metal texture */}
          <div className="relative rounded-xl bg-gradient-to-b from-zinc-600 via-zinc-700 to-zinc-800 p-1 shadow-[inset_0_3px_6px_rgba(0,0,0,0.7),inset_0_-2px_4px_rgba(255,255,255,0.15),0_4px_12px_rgba(0,0,0,0.4)]">
            {/* Inner engraved surface with brushed metal texture */}
            <div className="relative rounded-lg bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-700 px-4 py-1 shadow-[inset_0_3px_8px_rgba(0,0,0,0.9),inset_0_-1px_3px_rgba(255,255,255,0.08)]">
              {/* Engraved text with spaced lettering */}
              <div className="flex flex-col items-center leading-none">
                <div className="flex items-center gap-8">
                  <h1 className="text-lg font-black uppercase tracking-[0.8em] text-zinc-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] md:text-xl">
                    P I L O T
                  </h1>
                  <h2 className="text-lg font-black uppercase tracking-[0.8em] text-zinc-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] md:text-xl">
                    S C E N A R I O
                  </h2>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-[1.2em] text-zinc-300 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] md:text-3xl mt-1">
                  S I M U L A T O R
                </h3>
              </div>
              {/* Realistic rivet details */}
              <div className="absolute top-0.5 left-0.5 h-1.5 w-1.5 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_2px_rgba(255,255,255,0.1)]" />
              <div className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-gradient-to-bl from-zinc-500 to-zinc-700 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_2px_rgba(255,255,255,0.1)]" />
              <div className="absolute bottom-0.5 left-0.5 h-1.5 w-1.5 rounded-full bg-gradient-to-tr from-zinc-500 to-zinc-700 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_2px_rgba(255,255,255,0.1)]" />
              <div className="absolute bottom-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-gradient-to-tl from-zinc-500 to-zinc-700 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_2px_rgba(255,255,255,0.1)]" />
            </div>
          </div>
        </div>

      </div>
    ),
    [currentStep, totalSteps, progress, headerStatus, motionEnabled]
  );

  // Count how many questions have been answered (completed screens beyond PRELIM_3)
  const questionsAnswered = Math.max(0, state.currentScreenIndex - 3);
  console.log('🔍 Questions answered calc:', { currentScreenIndex: state.currentScreenIndex, currentScreen: state.currentScreen, questionsAnswered });

  return (
    <AppContainer
      headerZone={headerZone}
      screenZone={screenZone}
      keypadZone={keypadZone}
      footerZone={footerZone}
      disableMotion={!motionEnabled}
      scanlines={motionEnabled}
      questionsAnswered={questionsAnswered}
    />
  );
}
