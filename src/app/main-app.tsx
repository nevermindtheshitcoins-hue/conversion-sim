'use client';

import { useMemo, useEffect } from 'react';
import { AppContainer } from '../components/AppContainer';
import { QuestionsAndAnswers } from '../components/QuestionsAndAnswers';
import { ControlPanel } from '../components/ControlPanel';
import type { Selection } from '../components/Buttons';
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

  const selections = useMemo<Selection[]>(() => {
    return state.currentOptions.map((label, index) => {
      const id = index + 1;
      const isActive = state.isMultiSelect
        ? state.multiSelections.includes(id)
        : state.tempSelection === id;

      return {
        id,
        label,
        active: isActive,
      };
    });
  }, [state.currentOptions, state.isMultiSelect, state.multiSelections, state.tempSelection]);

  const textInputMeta = state.isTextInput
    ? {
        value: state.textValue,
        onChange: handlers.handleTextChange,
        placeholder: 'Describe your scenario where DeVOTE technology could be used...',
        maxLength: 500,
        minLength: 5,
      }
    : undefined;

  const progressMeta = {
    currentStep,
    totalSteps,
    percent: progressPercent,
    label: `Step ${currentStep} of ${totalSteps}`,
  };

  const handleSelection = (selection: Selection) => {
    handlers.handleSelection(selection.id, state.isMultiSelect);
  };

  const statusMessages = state.error ? (
    <div className="flex flex-col items-end gap-2">
      <div className="inline-flex max-w-xs items-center gap-2 rounded-lg border border-red-500/40 bg-red-900/70 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-red-100 shadow-lg">
        <span>{state.error}</span>
      </div>
    </div>
  ) : null;

  const screen = (
    <CRTShell
      status={statusMessages}
      disableMotion={!useFpsBudget}
      scanlines={useFpsBudget}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.45em] text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
            <span>Business Proof</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-medium tracking-normal">
            Step {currentStep}
          </span>
        </div>
        <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <QuestionsAndAnswers
          title={state.currentTitle}
          subtitle={state.currentSubtitle}
          industry={state.industry || ''}
          isLoading={state.isLoading}
          reportData={state.reportData}
          showTextPreview={state.isTextInput && state.textValue.length > 0}
          textPreview={state.textValue}
          hoveredOptionLabel={hoveredOptionLabel}
        />
      </div>
    </CRTShell>
  );

  const controls = (
    <ControlPanel
      selections={selections}
      multiSelect={state.isMultiSelect}
      onSelect={handleSelection}
      onConfirm={handlers.handleConfirm}
      canConfirm={navigationState.canConfirm}
      ariaDisabled={!navigationState.canConfirm && !state.isReport}
      onBack={handlers.handleBack}
      onReset={handlers.handleReset}
      error={state.error}
      progress={progressMeta}
      textInput={textInputMeta}
      isReport={state.isReport}
      onCopyReport={handlers.handleCopyReport}
      isFirstStep={navigationState.isFirstScreen}
      hoveredSelectionId={state.hoveredOption}
      onHover={handlers.handleHover}
    />
  );

  return <AppContainer screen={screen} controls={controls} />;
}
