'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAssessmentFlow } from '../hooks/useAssessmentFlow';
import { ReportDisplay } from './ReportDisplay';

export default function ScopingTerminal() {
  const { state, navigationState, handlers } = useAssessmentFlow();
  const {
    handleSelection,
    handleTextChange,
    handleConfirm,
    handleBack,
    handleReset,
    handleCopyReport,
    handleHover,
    handleRetryAiQuestions,
  } = handlers;

  const [multiLimitMessage, setMultiLimitMessage] = useState<string | null>(null);

  const totalScreens = Math.max(state.totalScreens, 1);
  const currentStep = Math.min(state.currentScreenIndex + 1, totalScreens);
  const ledCount = Math.max(totalScreens, 9);

  useEffect(() => {
    if (!multiLimitMessage) {
      return;
    }
    const timer = window.setTimeout(() => setMultiLimitMessage(null), 2500);
    return () => window.clearTimeout(timer);
  }, [multiLimitMessage]);

  useEffect(() => {
    if (state.isMultiSelect && state.multiSelections.length < state.maxSelections) {
      setMultiLimitMessage(null);
    }
  }, [state.isMultiSelect, state.multiSelections, state.maxSelections]);

  const instructionText = useMemo(() => {
    if (state.isLoading) {
      return '► PROCESSING...';
    }
    if (state.isReport) {
      return '► REVIEW REPORT, PRESS CONFIRM';
    }
    if (state.isTextInput) {
      return '► ENTER RESPONSE, PRESS CONFIRM';
    }
    if (state.isMultiSelect) {
      return `► SELECT UP TO ${state.maxSelections}, PRESS CONFIRM`;
    }
    return '► SELECT OPTION, PRESS CONFIRM';
  }, [state.isLoading, state.isReport, state.isTextInput, state.isMultiSelect, state.maxSelections]);

  const handleOptionSelect = useCallback(
    (index: number) => {
      if (state.isLoading) {
        return;
      }

      if (index < 0 || index >= state.currentOptions.length) {
        return;
      }

      const value = index + 1;

      if (state.isMultiSelect) {
        const alreadySelected = state.multiSelections.includes(value);
        if (!alreadySelected && state.multiSelections.length >= state.maxSelections) {
          setMultiLimitMessage(`MAX ${state.maxSelections} SELECTIONS`);
          return;
        }
        setMultiLimitMessage(null);
        handleSelection(value, true);
        return;
      }

      setMultiLimitMessage(null);
      handleSelection(value, false);
    },
    [
      handleSelection,
      state.isLoading,
      state.isMultiSelect,
      state.multiSelections,
      state.maxSelections,
      state.currentOptions.length,
    ]
  );

  const handleOptionKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>, index: number, disabled: boolean) => {
      if (disabled || state.isLoading) {
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleOptionSelect(index);
      }
    },
    [handleOptionSelect, state.isLoading]
  );

  const confirmDisabled = state.isReport ? false : !navigationState.canConfirm || state.isLoading;
  const backDisabled = navigationState.isFirstScreen || state.isLoading;
  const resetDisabled = state.isLoading;
  const statusText = state.error ? 'ATTENTION' : state.isLoading ? 'PROCESSING' : 'READY';

  const renderOptions = () => {
    if (state.isReport) {
      if (state.isLoading) {
        return (
          <div className="option-message info" role="status">Generating report...</div>
        );
      }
      if (state.reportData) {
        return (
          <div className="report-wrapper">
            <ReportDisplay reportData={state.reportData} />
          </div>
        );
      }
      return (
        <div className="option-message info" role="status">Report will appear here shortly.</div>
      );
    }

    if (state.isTextInput) {
      return (
        <div className="text-input-container">
          <textarea
            className="text-input-area"
            value={state.textValue}
            onChange={event => handleTextChange(event.target.value)}
            maxLength={100}
            placeholder="Describe your scenario or focus area..."
            aria-label="Describe your strategic initiative"
            disabled={state.isLoading}
          />
          <div className="text-input-meta">
            <span>Minimum 5 characters</span>
            <span>{state.textValue.trim().length}/100</span>
          </div>
        </div>
      );
    }

    const actualOptions = state.currentOptions.slice(0, 7);
    const paddedOptions = actualOptions.concat(Array(Math.max(0, 7 - actualOptions.length)).fill(''));

    if (state.isLoading && !actualOptions.length) {
      return (
        <div className="option-message info" role="status">Loading options...</div>
      );
    }

    if (!actualOptions.length && !state.isLoading) {
      return (
        <div className="option-message info">Awaiting next prompt...</div>
      );
    }

    return paddedOptions.map((option, index) => {
      const hasLabel = Boolean(option);
      const value = index + 1;
      const isSelected = hasLabel
        ? state.isMultiSelect
          ? state.multiSelections.includes(value)
          : state.tempSelection === value
        : false;
      const limitReached = hasLabel && state.isMultiSelect && !isSelected && state.multiSelections.length >= state.maxSelections;
      const disabled = state.isLoading || !hasLabel || limitReached;

      return (
        <div
          key={`${option || 'placeholder'}-${index}`}
          className={`option${isSelected ? ' selected' : ''}${disabled ? ' disabled' : ''}${!hasLabel ? ' placeholder' : ''}`}
          onClick={() => {
            if (!disabled && hasLabel) {
              handleOptionSelect(index);
            }
          }}
          onKeyDown={event => handleOptionKeyDown(event, index, disabled)}
          onMouseEnter={() => (hasLabel && !disabled ? handleHover(value) : undefined)}
          onMouseLeave={() => handleHover(null)}
          onFocus={() => (hasLabel && !disabled ? handleHover(value) : undefined)}
          onBlur={() => handleHover(null)}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-pressed={isSelected}
          aria-disabled={disabled}
        >
          <div className="option-text">{option || ''}</div>
        </div>
      );
    });
  };

  return (
    <>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
    font-family: 'Share Tech Mono', 'Courier New', monospace;
    color: #00ff88;
    line-height: 1.4;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
  }
  
  /* Physical booth housing */
  .booth {
    width: 900px;
    max-width: 95vw;
    background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #2a2a2a 100%);
    border: 8px solid #333;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 
      0 50px 100px rgba(0, 0, 0, 0.9),
      inset 0 2px 4px rgba(255, 255, 255, 0.05),
      inset 0 -2px 4px rgba(0, 0, 0, 0.8);
    position: relative;
  }
  
  /* Corner rivets */
  .booth::before,
  .booth::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #444, #222);
    box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.8);
  }
  .booth::before { top: 16px; left: 16px; }
  .booth::after { top: 16px; right: 16px; }
  
  /* Top placard */
  .placard {
    background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%);
    border: 2px solid #444;
    border-radius: 6px;
    padding: 12px 24px;
    margin-bottom: 20px;
    text-align: center;
    box-shadow: 
      inset 0 3px 6px rgba(0, 0, 0, 0.7),
      inset 0 -2px 4px rgba(255, 255, 255, 0.1),
      0 4px 12px rgba(0, 0, 0, 0.4);
    position: relative;
  }
  
  .placard::before,
  .placard::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #555, #333);
    top: 8px;
  }
  .placard::before { left: 12px; }
  .placard::after { right: 12px; }
  
  .placard-title {
    font-size: 16px;
    letter-spacing: 6px;
    color: #00ff88;
    text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
    margin-bottom: 4px;
  }
  
  .placard-subtitle {
    font-size: 10px;
    letter-spacing: 3px;
    color: #00ff8866;
  }
  
  /* Screen bezel */
  .bezel {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 12px solid #222;
    border-radius: 8px;
    box-shadow: 
      inset 0 0 40px rgba(0, 0, 0, 0.9),
      0 0 30px rgba(0, 0, 0, 0.8);
    padding: 0;
    margin-bottom: 20px;
    position: relative;
  }
  
  /* Inner screen glow */
  .bezel::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 60px rgba(0, 255, 136, 0.08);
    pointer-events: none;
    z-index: 2;
  }
  
  .terminal {
    background: #000;
    border: 2px solid #00ff88;
    box-shadow: inset 0 0 80px rgba(0, 255, 136, 0.05);
    display: flex;
    flex-direction: column;
    position: relative;
    filter: contrast(1.2);
    height: 520px;
  }
  
  /* Scanlines */
  .terminal::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    z-index: 1000;
  }
  
  .header {
    border-bottom: 1px solid #00ff88;
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    letter-spacing: 2px;
  }
  
  .logo {
    font-size: 16px;
    font-weight: bold;
  }
  
  .system-tag {
    color: #00ff8866;
    font-size: 10px;
  }
  
  .title-bar {
    border-bottom: 1px solid #00ff88;
    padding: 20px 16px;
    text-align: center;
  }
  
  .title-bar h1 {
    font-size: 20px;
    letter-spacing: 6px;
    margin-bottom: 6px;
  }
  
  .title-bar .subtitle {
    font-size: 11px;
    color: #00ff8899;
    letter-spacing: 2px;
  }
  
  .content {
    display: grid;
    grid-template-columns: 1fr 340px;
    flex: 1;
    border-bottom: 1px solid #00ff88;
    overflow: hidden;
  }
  
  .screen {
    border-right: 1px solid #00ff88;
    padding: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: radial-gradient(ellipse at center, rgba(0, 255, 136, 0.02) 0%, transparent 70%);
  }
  
  .screen h2 {
    font-size: 28px;
    letter-spacing: 4px;
    margin-bottom: 16px;
    line-height: 1.2;
  }
  
  .screen p {
    font-size: 13px;
    color: #00ff88cc;
    letter-spacing: 1px;
    margin-bottom: 16px;
  }

  .question-readout {
    margin-top: 16px;
    padding: 12px 16px;
    border: 1px solid #00ff8844;
    background: rgba(0, 255, 136, 0.08);
    text-align: left;
  }

  .question-readout-title {
    font-size: 14px;
    letter-spacing: 2px;
    color: #00ff88;
    margin-bottom: 6px;
  }

  .question-readout-subtitle {
    font-size: 12px;
    color: #00ff88bb;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }

  .question-readout-note {
    font-size: 10px;
    color: #00ff8866;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  
  .screen .instruction {
    font-size: 10px;
    color: #00ff8866;
    letter-spacing: 4px;
    text-transform: uppercase;
    animation: blink 2s infinite;
  }
  
  .help-text {
    margin-top: 14px;
    font-size: 10px;
    letter-spacing: 3px;
    color: #00ff88aa;
    text-transform: uppercase;
  }
  
  .message {
    margin-top: 18px;
    font-size: 11px;
    letter-spacing: 2px;
    line-height: 1.6;
    white-space: pre-wrap;
  }
  
  .message.error {
    color: #ff6b6b;
  }
  
  .message.warning {
    color: #ffc857;
  }
  
  .message.info {
    color: #00ff88cc;
  }
  
  .message button {
    margin-top: 10px;
    border: 1px solid #00ff88;
    background: rgba(0, 255, 136, 0.08);
    color: #00ff88;
    padding: 6px 12px;
    font-family: inherit;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
  }
  
  .message button:hover {
    background: rgba(0, 255, 136, 0.2);
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.4; }
  }
  
  .options {
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  
  .text-input-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .text-input-area {
    width: 100%;
    min-height: 180px;
    background: #050505;
    border: 1px solid #00ff8833;
    border-left: 3px solid #00ff88;
    color: #00ff88;
    padding: 16px;
    font-family: inherit;
    font-size: 13px;
    letter-spacing: 1px;
    line-height: 1.5;
    resize: vertical;
  }
  
  .text-input-area:focus {
    outline: none;
    border-color: #00ff88;
    box-shadow: 0 0 12px rgba(0, 255, 136, 0.15);
  }
  
  .text-input-area::placeholder {
    color: #00ff8866;
  }
  
  .text-input-meta {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    letter-spacing: 2px;
    color: #00ff8866;
  }
  
  .option {
    border: 1px solid #00ff8833;
    background: #0a0a0a;
    padding: 14px 16px;
    margin-bottom: 6px;
    font-size: 12px;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.15s;
    position: relative;
  }
  
  .option::before {
    content: '[ ]';
    position: absolute;
    left: 16px;
    color: #00ff8866;
  }
  
  .option-text {
    margin-left: 32px;
  }
  
  .option:hover {
    border-color: #00ff88;
    background: rgba(0, 255, 136, 0.05);
  }
  
  .option.selected {
    border-color: #00ff88;
    background: rgba(0, 255, 136, 0.1);
    box-shadow: inset 0 0 20px rgba(0, 255, 136, 0.1);
  }

  .option.selected::before {
    content: '[●]';
    color: #00ff88;
  }

  .option.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .option.disabled::before {
    color: #00ff8844;
  }

  .option.placeholder {
    opacity: 0.2;
    cursor: default;
    pointer-events: none;
  }

  .option.placeholder::before {
    color: #00ff8822;
  }
  
  .option-message {
    border: 1px solid #00ff8833;
    background: rgba(0, 255, 136, 0.04);
    padding: 18px 16px;
    margin-bottom: 6px;
    font-size: 12px;
    letter-spacing: 2px;
    text-align: left;
  }
  
  .option-message.info {
    color: #00ff88cc;
    border-color: #00ff8844;
  }
  
  .option-message.error {
    color: #ff6b6b;
    border-color: #ff6b6b66;
  }
  
  .report-wrapper {
    padding-right: 6px;
  }
  
  .footer {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 12px 16px;
    gap: 16px;
    font-size: 11px;
  }
  
  .status {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .status-indicator {
    display: flex;
    gap: 3px;
  }
  
  .led {
    width: 10px;
    height: 10px;
    background: #00ff8822;
    border: 1px solid #00ff8844;
  }
  
  .led.active {
    background: #00ff88;
    box-shadow: 0 0 6px #00ff88;
  }
  
  .status-text {
    letter-spacing: 2px;
  }
  
  .progress {
    text-align: center;
    letter-spacing: 3px;
    color: #00ff88cc;
  }
  
  /* Control panel */
  .control-panel {
    background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
    border: 4px solid #333;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    gap: 12px;
    justify-content: center;
    box-shadow: 
      inset 0 3px 6px rgba(0, 0, 0, 0.6),
      0 4px 12px rgba(0, 0, 0, 0.4);
  }
  
  .btn {
    width: 64px;
    height: 64px;
    border: 3px solid;
    background: #1a1a1a;
    color: #00ff88;
    font-family: inherit;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.6),
      inset 0 -2px 4px rgba(0, 0, 0, 0.4);
    position: relative;
  }
  
  .btn::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    height: 8px;
    background: linear-gradient(180deg, rgba(255,255,255,0.1), transparent);
    pointer-events: none;
  }
  
  .btn:hover:not(:disabled) {
    background: rgba(0, 255, 136, 0.05);
    transform: translateY(-2px);
  }
  
  .btn:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.6),
      inset 0 2px 6px rgba(0, 0, 0, 0.6);
  }
  
  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  
  .btn-reset {
    border-color: #ff6b00;
    color: #ff6b00;
  }
  
  .btn-back {
    border-color: #ff4444;
    color: #ff4444;
  }
  
  .btn-confirm {
    border-color: #00ff88;
    color: #00ff88;
  }
  
  /* Scrollbar */
  .options::-webkit-scrollbar {
    width: 6px;
  }
  
  .options::-webkit-scrollbar-track {
    background: #0a0a0a;
  }
  
  .options::-webkit-scrollbar-thumb {
    background: #00ff8844;
  }
  
  .options::-webkit-scrollbar-thumb:hover {
    background: #00ff8866;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .content {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto;
    }
    
    .screen {
      border-right: none;
      border-bottom: 1px solid #00ff88;
      padding: 24px;
    }
    
    .options {
      max-height: 200px;
    }
    
    .btn {
      width: 56px;
      height: 56px;
      font-size: 20px;
    }
  }
      `}</style>

      <div className="booth">
        <div className="placard">
          <div className="placard-title">PILOT SCOPING TERMINAL</div>
          <div className="placard-subtitle">DEVOTE VOTING INFRASTRUCTURE</div>
        </div>
        
        <div className="bezel">
          <div className="terminal">
            <div className="header">
              <div className="logo">DEVOTE</div>
              <div className="system-tag">v2.1.0</div>
            </div>
            
            <div className="title-bar">
              <h1>SCENARIO ASSESSMENT</h1>
              <div className="subtitle">PRIMARY USE CASE SELECTION</div>
            </div>
            
            <div className="content">
              <div className="screen">
                <h2>WHAT TRIGGERED THIS?</h2>
                <p>Select the scenario that led you to explore better voting infrastructure.</p>
                <div className="instruction">{instructionText}</div>
                {(state.currentTitle || state.currentSubtitle) && (
                  <div className="question-readout">
                    {state.currentTitle && (
                      <div className="question-readout-title">{state.currentTitle}</div>
                    )}
                    {state.currentSubtitle && (
                      <div className="question-readout-subtitle">{state.currentSubtitle}</div>
                    )}
                    {state.isMultiSelect && !state.isLoading ? (
                      <div className="question-readout-note">Select up to {state.maxSelections} options.</div>
                    ) : null}
                    {state.isTextInput && !state.isLoading ? (
                      <div className="question-readout-note">Enter at least 5 characters to continue.</div>
                    ) : null}
                    {state.isReport && !state.isLoading ? (
                      <div className="question-readout-note">Review the generated report below.</div>
                    ) : null}
                  </div>
                )}
                {multiLimitMessage ? <div className="message warning">{multiLimitMessage}</div> : null}
                {state.error ? (
                  <div className="message error" role="alert">
                    {state.error}
                    {state.aiGenerated && !state.isLoading ? (
                      <button type="button" onClick={() => handleRetryAiQuestions()}>Retry Generation</button>
                    ) : null}
                  </div>
                ) : null}
              </div>
              
              <div className="options" aria-live="polite">
                {renderOptions()}
              </div>
            </div>
            
            <div className="footer">
              <div className="status">
                <div className="status-indicator">
                  {Array.from({ length: ledCount }, (_, idx) => (
                    <div key={idx} className={`led${idx < currentStep ? ' active' : ''}`} />
                  ))}
                </div>
                <div className="status-text">{statusText}</div>
              </div>
              
              <div className="progress">Q{currentStep}/{totalScreens}</div>
            </div>
          </div>
        </div>
        
        <div className="control-panel">
          <button
            className="btn btn-reset"
            title="Restart"
            onClick={() => handleReset()}
            aria-label="Restart"
            disabled={resetDisabled}
          >
            ↻
          </button>
          <button
            className="btn btn-back"
            title="Back"
            onClick={() => handleBack()}
            aria-label="Back"
            disabled={backDisabled}
          >
            ←
          </button>
          <button
            className="btn btn-confirm"
            title={state.isReport ? 'Copy report' : 'Confirm'}
            onClick={() => {
              if (state.isReport) {
                void handleCopyReport();
              } else {
                void handleConfirm();
              }
            }}
            aria-label={state.isReport ? 'Copy report to clipboard' : 'Confirm'}
            disabled={confirmDisabled}
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}
