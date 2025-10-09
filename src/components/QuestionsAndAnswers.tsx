import { Loader2 } from 'lucide-react';
import { ReportData } from '../types/report';
import { ReportDisplay } from './ReportDisplay';

interface QuestionsAndAnswersProps {
  title: string;
  subtitle?: string;
  industry: string;
  isLoading: boolean;
  reportData: ReportData | null;
  showTextPreview: boolean;
  textPreview: string;
  hoveredOptionLabel?: string;
}

export function QuestionsAndAnswers({
  title,
  isLoading,
  reportData,
}: QuestionsAndAnswersProps) {
  return (
    <div className="h-full flex items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-300" />
          <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">Running analysis…</p>
        </div>
      ) : reportData ? (
        <ReportDisplay reportData={reportData} />
      ) : (
        <div className="text-center">
          <h2 className="text-5xl font-bold uppercase tracking-tight text-yellow-300">
            {title}
          </h2>
          <p className="mt-8 text-lg text-zinc-400">Select a focus area and press green to confirm.</p>
        </div>
      )}
    </div>
  );
}
