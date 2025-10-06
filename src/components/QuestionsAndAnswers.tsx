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
  subtitle,
  industry,
  isLoading,
  reportData,
  showTextPreview,
  textPreview,
  hoveredOptionLabel,
}: QuestionsAndAnswersProps) {
  return (
    <section className="col-span-full lg:col-span-7">
      <div className="h-full rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#0d1218] via-[#0a1016] to-[#05080b] px-10 py-12 flex flex-col">
        {isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-300" />
            <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
              Running analysis…
            </p>
          </div>
        ) : reportData ? (
          <ReportDisplay reportData={reportData} />
        ) : (
          <div className="space-y-6 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">
              Your assessment
            </p>
            <h2 className="text-4xl font-semibold uppercase tracking-tight text-yellow-300 leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-zinc-400 leading-relaxed">{subtitle}</p>
            )}
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
              Pick one below
            </p>
            {industry && (
              <p className="text-sm text-zinc-500">
                Industry: <span className="text-zinc-300">{industry}</span>
              </p>
            )}
            {showTextPreview && (
              <div className="rounded-xl border border-zinc-800/50 bg-black/30 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">
                  Custom scenario
                </p>
                <p className="text-sm text-zinc-100 mt-2 leading-relaxed">
                  {textPreview}
                </p>
              </div>
            )}
            {hoveredOptionLabel && (
              <div className="rounded-xl border border-zinc-800/40 bg-black/20 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                  Focused option
                </p>
                <p className="text-sm text-zinc-100 mt-2 leading-relaxed">
                  {hoveredOptionLabel}
                </p>
              </div>
            )}
          </div>
        )}
        <footer className="mt-auto pt-10 text-xs text-zinc-500 uppercase tracking-[0.35em]">
          © Business Assessment Tool · AI-driven · Industry-specific · Auditable reports
        </footer>
      </div>
    </section>
  );
}
