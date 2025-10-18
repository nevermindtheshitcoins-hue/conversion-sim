'use client';

import { useMemo } from 'react';
import { ZonedScreen } from '../components/ZonedScreen';
import { useAssessmentFlow } from '../hooks/useAssessmentFlow';
import VotingBoothShell from '../components/VotingBoothShell';
import { VotingBoothCasing } from '../components/VotingBoothCasing';
import { VotingBoothKeypad } from '../components/VotingBoothKeypad';
import { VotingBoothControls } from '../components/VotingBoothControls';
import { KeypadZone } from '../components/zones/KeypadZone';
import { FooterZone, createFooterMessage } from '../components/zones/FooterZone';

export default function MainApp() {
  const { state, navigationState, handlers } = useAssessmentFlow();
  const totalSteps = Math.max(state.totalScreens, 1);
  const currentStep = Math.min(state.currentScreenIndex + 1, totalSteps);
  const motionEnabled = state.motionEnabled;


  const keypadZone = useMemo(
    () => (
      <KeypadZone disableAnimations={!motionEnabled}>
        <VotingBoothKeypad
          options={state.currentOptions}
          tempSelection={state.tempSelection}
          multiSelections={state.multiSelections}
          isMultiSelect={state.isMultiSelect}
          isTextInput={state.isTextInput}
          onSelect={handlers.handleSelection}
          onHover={handlers.handleHover}
        />
      </KeypadZone>
    ),
    [
      state.isTextInput,
      state.isMultiSelect,
      state.currentOptions,
      state.tempSelection,
      state.multiSelections,
      handlers.handleSelection,
      handlers.handleHover,
      motionEnabled,
    ]
  );

  const footerMessages = useMemo(() => {
    const messages = [];

    if (state.error) {
      messages.push(createFooterMessage('error', state.error, 150));
    }

    return messages;
  }, [state.error]);

  const footerZone = useMemo(
    () => (
      <FooterZone
        messages={footerMessages}
        disableAnimations={!motionEnabled}
      >
        <VotingBoothControls
          onReset={handlers.handleReset}
          onBack={handlers.handleBack}
          onConfirm={state.isReport ? handlers.handleCopyReport : handlers.handleConfirm}
          canGoBack={!navigationState.isFirstScreen}
          canConfirm={navigationState.canConfirm}
          isReport={state.isReport}
        />
      </FooterZone>
    ),
    [
      handlers.handleReset,
      handlers.handleBack,
      handlers.handleCopyReport,
      handlers.handleConfirm,
      navigationState.isFirstScreen,
      navigationState.canConfirm,
      state.isReport,
      footerMessages,
      motionEnabled,
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

  return (
    <VotingBoothCasing
      currentStep={currentStep}
      disableMotion={!motionEnabled}
    >
      <VotingBoothShell
        displayZone={screenZone}
        keypadZone={keypadZone}
        footerZone={footerZone}
        disableMotion={!motionEnabled}
        scanlines={motionEnabled}
      />
    </VotingBoothCasing>
  );
}
