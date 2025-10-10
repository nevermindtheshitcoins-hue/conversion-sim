'use client';

import { useMemo } from 'react';
import { AppContainer } from '../components/AppContainer';
import { ControlPanel } from '../components/ControlPanel';
import { ZonedScreen } from '../components/ZonedScreen';
import { RefreshCcw } from 'lucide-react';
import { useAssessmentFlow } from '../hooks/useAssessmentFlow';
import CRTShell from '../components/CRTShell';
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
    () => (
      <ControlPanel
        options={state.currentOptions}
        tempSelection={state.tempSelection}
        multiSelections={state.multiSelections}
        isMultiSelect={state.isMultiSelect}
        isTextInput={state.isTextInput}
        onSelect={handlers.handleSelection}
        onHover={handlers.handleHover}
      />
    ),
    [
      state.currentOptions,
      state.tempSelection,
      state.multiSelections,
      state.isMultiSelect,
      state.isTextInput,
      handlers.handleSelection,
      handlers.handleHover,
    ]
  );

  const footerZone = useMemo(
    () => (
    <div className="flex items-center justify-between px-4">
      <button
        type="button"
        onClick={handlers.handleReset}
        aria-label="Reset assessment"
        className={`h-14 w-14 ${BUTTON_STYLES.base} ${BUTTON_STYLES.accent} ${FOCUS_STYLES.ring}`}
      >
        <RefreshCcw className="h-6 w-6 mx-auto text-yellow-900" />
      </button>
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={handlers.handleBack}
          disabled={navigationState.isFirstScreen}
          aria-label="Go back to previous step"
          className={`h-20 w-20 ${BUTTON_STYLES.base} ${BUTTON_STYLES.secondary} ${FOCUS_STYLES.ring} ${
            navigationState.isFirstScreen ? BUTTON_STYLES.secondaryDisabled : ''
          }`}
        />
        <button
          type="button"
          onClick={state.isReport ? handlers.handleCopyReport : handlers.handleConfirm}
          disabled={!navigationState.canConfirm && !state.isReport}
          aria-label={state.isReport ? 'Copy report to clipboard' : 'Confirm selection and continue'}
          className={`h-20 w-20 ${BUTTON_STYLES.base} ${FOCUS_STYLES.ring} ${
            navigationState.canConfirm || state.isReport
              ? BUTTON_STYLES.primary
              : BUTTON_STYLES.primaryDisabled
          }`}
        />
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

  const screen = useMemo(
    () => (
      <CRTShell
        headerZone={<div />}
        screenZone={
          <ZonedScreen
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
            status={headerStatus}
            contentType={state.contentType}
            title={state.currentTitle}
            subtitle={state.currentSubtitle}
            industry={state.industry}
            options={state.currentOptions}
            isLoading={state.isLoading}
            reportData={state.reportData}
            textValue={state.textValue}
            onTextChange={handlers.handleTextChange}
            error={state.error}
            hoveredText={hoveredOptionLabel}
            disableAnimations={!motionEnabled}
          />
        }
        keypadZone={keypadZone}
        footerZone={footerZone}
        disableMotion={!motionEnabled}
        scanlines={motionEnabled}
      />
    ),
    [
      currentStep,
      totalSteps,
      progress,
      headerStatus,
      state.contentType,
      state.currentTitle,
      state.currentSubtitle,
      state.industry,
      state.currentOptions,
      state.isLoading,
      state.reportData,
      state.textValue,
      handlers.handleTextChange,
      state.error,
      hoveredOptionLabel,
      motionEnabled,
      keypadZone,
      footerZone,
    ]
  );

  return (
    <AppContainer
      screen={screen}
    />
  );
}
