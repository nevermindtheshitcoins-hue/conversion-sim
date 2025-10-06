'use client';

import React from 'react';
import { AppContainer } from '../components/AppContainer';
import { QuestionsAndAnswers } from '../components/QuestionsAndAnswers';
import { Buttons } from '../components/Buttons';
import { useAssessmentFlow } from '../hooks/useAssessmentFlow';

export default function MainApp() {
  const { state, navigationState, handlers } = useAssessmentFlow();
  const currentStep = Math.min(state.currentScreenIndex + 1, state.totalScreens);
  const totalSteps = Math.max(state.totalScreens, 1);
  const progressPercent = Math.max(0, Math.min(100, state.progress));
  const hoveredOptionLabel =
    state.hoveredOption != null &&
    state.hoveredOption > 0 &&
    state.hoveredOption <= state.currentOptions.length
      ? state.currentOptions[state.hoveredOption - 1]
      : undefined;

  return (
    <AppContainer>
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
        <div className="grid gap-8 lg:grid-cols-[1.4fr,1fr]">
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
          <Buttons
            isTextInput={state.isTextInput}
            isMultiSelect={state.isMultiSelect}
            textValue={state.textValue}
            onTextChange={handlers.handleTextChange}
            options={state.currentOptions}
            tempSelection={state.tempSelection}
            multiSelections={state.multiSelections}
            onSelect={handlers.handleSelection}
            onConfirm={handlers.handleConfirm}
            onBack={handlers.handleBack}
            onReset={handlers.handleReset}
            canConfirm={navigationState.canConfirm}
            error={state.error}
            isReport={state.isReport}
            onCopyReport={handlers.handleCopyReport}
            isFirstScreen={navigationState.isFirstScreen}
            onHover={handlers.handleHover}
            hoveredOption={state.hoveredOption}
            progress={progressPercent}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        </div>
      </div>
    </AppContainer>
  );
}
