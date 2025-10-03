import { Loader2 } from 'lucide-react';
import { ReportData } from '../types/report';
import { ReportDisplay } from './ReportDisplay';

interface QuestionsAndAnswersProps {
  progress: number;
  title: string;
  industry: string;
  isLoading: boolean;
  reportData: ReportData | null;
  showTextPreview: boolean;
  textPreview: string;
}

export function QuestionsAndAnswers({
  progress,
  title,
  industry,
  isLoading,
  reportData,
  showTextPreview,
  textPreview,
}: QuestionsAndAnswersProps) {
  return (
    <section className="col-span-8 rounded-2xl bg-[#0b1114] border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5" />
      <div className="relative h-full grid place-items-center p-10" role="main" aria-live="polite">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="h-16 w-16 animate-spin text-emerald-400" />
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-yellow-300 drop-shadow">
              Running analysis...
            </h2>
          </div>
        ) : reportData ? (
          <div className="text-center h-full flex flex-col justify-center">
            <h2 className="text-2xl font-extrabold tracking-widest text-yellow-300 drop-shadow mb-4">
              Your deployment score
            </h2>
            <p className="text-sm tracking-[0.2em] text-emerald-300 mb-4">
              Performance breakdown. Press Green Button to copy.
            </p>
            <ReportDisplay reportData={reportData} />
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest text-yellow-300 drop-shadow mb-4" id="question-title">
              {title}
            </h2>
            <p className="text-sm tracking-[0.35em] text-emerald-300">
              Pick one below
            </p>
            {industry && (
              <p className="text-xs text-white/60 mt-2">Industry: {industry}</p>
            )}
            {showTextPreview && (
              <div className="mt-4 p-3 bg-black/20 rounded-lg max-w-2xl mx-auto" role="status" aria-label="Text preview">
                <p className="text-xs text-emerald-300 mb-1">Type your answer below:</p>
                <p className="text-yellow-300 text-sm">{textPreview}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
