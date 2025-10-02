'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import { generateQuestionsFromPrelims, generateCustomReport } from '../ai/flows/full-context-flow';
import { JourneyTracker } from '../lib/journey-tracker';
import { getScreenConfig } from '../lib/screen-config-new';

const INDUSTRIES = [
  'Technology & Software',
  'Healthcare & Medical', 
  'Financial Services',
  'E-commerce & Retail',
  'Manufacturing'
];

const TICKER_ITEMS = [
  'INDUSTRY ASSESSMENT',
  'AI POWERED INSIGHTS',
  'CUSTOM REPORTS',
  'BUSINESS OPTIMIZATION',
  '8-FACTOR ANALYSIS'
];

const SCREEN_ORDER = ['PRELIM_1', 'PRELIM_2', 'PRELIM_3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'REPORT'];

export default function ConversionTool() {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [journeyTracker] = useState(() => new JourneyTracker());
  const [tempSelection, setTempSelection] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [industry, setIndustry] = useState<string>('');
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
  const [reportData, setReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const currentScreen = SCREEN_ORDER[currentScreenIndex];
  const progress = Math.round(((currentScreenIndex + 1) / SCREEN_ORDER.length) * 100);

  const getScreenContent = () => {
    if (currentScreen === 'PRELIM_1') return 'SELECT INDUSTRY';
    if (currentScreen === 'REPORT') return 'YOUR ASSESSMENT';
    if (currentScreen.startsWith('Q') && aiQuestions.length > 0) {
      const questionIndex = parseInt(currentScreen.substring(1)) - 4;
      return aiQuestions[questionIndex] || 'AI GENERATED QUESTION';
    }
    try {
      const config = getScreenConfig(currentScreen, industry);
      return config.title.toUpperCase();
    } catch {
      return 'ASSESSMENT QUESTION';
    }
  };

  const getOptions = () => {
    if (currentScreen === 'PRELIM_1') return INDUSTRIES;
    if (currentScreen.startsWith('Q') && aiQuestions.length > 0) {
      return [
        'Strongly agree - this is exactly my situation',
        'Somewhat agree - this applies to me partially',
        'Neutral - not sure how this applies',
        'Somewhat disagree - this doesn\'t quite fit',
        'Strongly disagree - this doesn\'t apply to me'
      ];
    }
    try {
      const config = getScreenConfig(currentScreen, industry);
      return config.options;
    } catch {
      return ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
    }
  };

  const handleConfirm = async () => {
    if (tempSelection === null) return;
    
    const options = getOptions();
    const buttonText = options[tempSelection - 1];
    
    if (currentScreen === 'PRELIM_1') {
      setIndustry(buttonText);
    }
    
    journeyTracker.addResponse(currentScreen, tempSelection, buttonText);
    setTempSelection(null);
    setError(null);
    setIsLoading(true);

    try {
      if (currentScreen === 'PRELIM_3') {
        const result = await generateQuestionsFromPrelims(
          journeyTracker.getFullContext(currentScreen),
          industry
        );
        if (result.questions) {
          setAiQuestions(result.questions);
        }
      }

      if (currentScreen === 'Q8') {
        const result = await generateCustomReport(
          journeyTracker.getFullContext(currentScreen),
          industry
        );
        setReportData(result);
      }

      setTimeout(() => {
        setCurrentScreenIndex(prev => prev + 1);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError('Processing error occurred');
      setTimeout(() => {
        setCurrentScreenIndex(prev => prev + 1);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleReset = () => {
    setCurrentScreenIndex(0);
    journeyTracker.clear();
    setTempSelection(null);
    setIndustry('');
    setAiQuestions([]);
    setReportData(null);
    setError(null);
  };

  const handleBack = () => {
    if (tempSelection !== null) {
      setTempSelection(null);
      return;
    }
    setCurrentScreenIndex(prev => Math.max(0, prev - 1));
  };

  const canConfirm = tempSelection !== null || currentScreenIndex >= SCREEN_ORDER.length;





  return (
    <div className="min-h-screen w-full bg-[#0a0f12] text-slate-100 flex flex-col font-sans">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/30">
          <div
            className="h-full bg-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_18px_2px_rgba(250,204,21,0.8)]" />
          <h1 className="text-lg tracking-[0.25em] font-semibold">ASSESSMENT TOOL</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-full text-xs tracking-widest border border-emerald-300/30 bg-emerald-900/30 text-emerald-300">
            STEP {currentScreenIndex + 1}
          </div>
        </div>
      </header>
      
      <div className="relative overflow-hidden border-b border-white/10 bg-black/40">
        <div className="absolute inset-x-0 top-0 h-1 bg-emerald-400/70 animate-pulse" />
        <div className="relative py-2">
          <div className="flex w-max animate-marquee">
            {TICKER_ITEMS.map((item, i) => (
              <span key={i} className="mx-8 text-white/80 text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <main className="flex-1 grid grid-cols-12 gap-6 p-6">
        <section className="col-span-9 rounded-2xl bg-[#0b1114] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5" />
          <div className="relative h-full grid place-items-center p-10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="h-16 w-16 animate-spin text-emerald-400" />
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-yellow-300 drop-shadow">
                  {currentScreen === 'PRELIM_3' ? 'GENERATING QUESTIONS...' : 
                   currentScreen === 'Q8' ? 'CREATING REPORT...' : 
                   'PROCESSING...'}
                </h2>
              </div>
            ) : currentScreenIndex >= SCREEN_ORDER.length ? (
              <div className="text-center h-full flex flex-col justify-center">
                <h2 className="text-2xl font-extrabold tracking-widest text-yellow-300 drop-shadow mb-4">
                  FICTIONAL SCENARIO REPORT
                </h2>
                <p className="text-sm tracking-[0.2em] text-emerald-300 mb-4">
                  Based on your selections. Press Green Button to copy.
                </p>
                <div className="text-left text-sm bg-black/20 p-4 rounded-lg overflow-y-auto max-h-80">
                  {reportData && reportData.response ? (
                    <div className="space-y-4">
                      <div className="text-yellow-300 font-bold mb-2">SCENARIO ANALYSIS:</div>
                      <div className="text-slate-300 whitespace-pre-wrap">{reportData.response}</div>
                      
                      {reportData.reportFactors && reportData.reportFactors.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <div className="text-emerald-300 font-bold">KEY FACTORS:</div>
                          {reportData.reportFactors.slice(0, 4).map((factor: any, index: number) => (
                            <div key={index} className="border-l-2 border-emerald-400/30 pl-3">
                              <div className="text-yellow-300 font-semibold text-xs">{factor.factor}</div>
                              <div className="text-slate-400 text-xs">{factor.analysis}</div>
                              <div className="text-emerald-300 text-xs mt-1">→ {factor.recommendation}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-300">
                      Your fictional business scenario has been generated based on your industry and responses.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-yellow-300 drop-shadow mb-4">
                  {getScreenContent()}
                </h2>
                <p className="text-sm tracking-[0.35em] text-emerald-300">
                  SELECT YOUR OPTION BELOW
                </p>
                {industry && (
                  <p className="text-xs text-white/60 mt-2">Industry: {industry}</p>
                )}
              </div>
            )}
          </div>
        </section>
        
        <aside className="col-span-3 flex flex-col">
          <div className="flex-1 space-y-4">
            {getOptions().slice(0, 5).map((option, index) => {
              const buttonValue = index + 1;
              const isSelected = tempSelection === buttonValue;
              
              return (
                <button
                  key={index}
                  onClick={() => setTempSelection(buttonValue)}
                  className={`
                    w-full rounded-2xl py-6 px-5 grid place-items-center border transition shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-cyan-400/60
                    active:translate-y-px
                    ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-400/30 ring-2 ring-emerald-400/70 shadow-inner'
                        : 'bg-slate-800/60 border-white/10 hover:bg-slate-800/80 hover:border-white/20'
                    }
                  `}
                >
                  <span
                    className={`uppercase text-xs tracking-widest ${
                      isSelected ? 'text-emerald-300' : 'text-yellow-300'
                    }`}
                    style={{
                      textShadow:
                        isSelected
                          ? '0 0 10px rgba(16,185,129,0.9), 0 0 18px rgba(16,185,129,0.5)'
                          : '0 0 8px rgba(253,224,71,0.8), 0 0 14px rgba(253,224,71,0.4)',
                    }}
                  >
                    {option.length > 20 ? option.substring(0, 20) + '...' : option}
                  </span>
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-3 items-end">
            <div className="flex items-center justify-center">
              <button
                onClick={handleReset}
                className="w-12 h-12 rounded-full bg-yellow-800/50 shadow-[0_0_10px_rgba(250,204,21,0.4)] border border-yellow-400/30 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-400/70 hover:bg-yellow-800/80 active:translate-y-px transition-all"
              >
                <RefreshCcw className="h-5 w-5 text-yellow-300" />
              </button>
            </div>
            <button
              onClick={handleBack}
              disabled={currentScreenIndex === 0}
              className="w-16 h-16 rounded-full bg-red-600/80 shadow-[0_0_30px_rgba(220,38,38,0.7)] border border-red-300/20 focus:outline-none focus:ring-2 focus:ring-red-400/70 active:translate-y-px transition-all disabled:opacity-50"
            />
            <button
              onClick={currentScreenIndex >= SCREEN_ORDER.length ? async () => {
                if (reportData && reportData.response) {
                  try {
                    const reportText = `FICTIONAL SCENARIO REPORT\n\n${reportData.response}\n\n${reportData.reportFactors?.map((f: any) => `${f.factor}: ${f.analysis} → ${f.recommendation}`).join('\n\n') || ''}`;
                    await navigator.clipboard.writeText(reportText);
                  } catch (err) {
                    console.warn('Clipboard access denied');
                  }
                }
              } : handleConfirm}
              disabled={!canConfirm && currentScreenIndex < SCREEN_ORDER.length}
              className={`
                w-16 h-16 rounded-full border focus:outline-none focus:ring-2 focus:ring-emerald-400/70
                transition-all active:translate-y-px
                ${
                  canConfirm || currentScreenIndex >= SCREEN_ORDER.length
                    ? 'bg-emerald-500 shadow-[0_0_34px_rgba(16,185,129,0.8)] border-emerald-200/40 cursor-pointer'
                    : 'bg-emerald-900/30 border-white/10 opacity-50 cursor-not-allowed'
                }
              `}
            />
          </div>
        </aside>
      </main>
      
      <footer className="px-6 py-3 text-[11px] text-white/40 border-t border-white/10">
        <div className="flex items-center gap-4">
          <span>© Business Assessment Tool</span>
          <span>AI-Powered • Industry-Specific • Custom Reports</span>
        </div>
      </footer>
    </div>
  );
}