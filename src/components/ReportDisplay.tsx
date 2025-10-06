import React from 'react';
import { ReportData } from '../types/report';

interface ReportDisplayProps {
  reportData: ReportData;
}

export const ReportDisplay = React.memo(function ReportDisplay({ reportData }: ReportDisplayProps) {
  return (
    <div className="text-left text-sm bg-gradient-to-br from-black/30 to-slate-900/30 p-6 rounded-xl overflow-y-auto max-h-96 border border-emerald-400/20 shadow-lg report-container">
      {reportData.response ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-emerald-400 rounded-full"></div>
            <div className="text-yellow-300 font-bold text-lg tracking-wide">DEPLOYMENT ANALYSIS</div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-lg border-l-4 border-emerald-400/50">
            <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">{reportData.response}</div>
          </div>

          {reportData.reportFactors && reportData.reportFactors.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-yellow-400 rounded-full"></div>
                <div className="text-emerald-300 font-bold text-lg tracking-wide">KEY SUCCESS FACTORS</div>
              </div>

              <div className="grid gap-4">
                {reportData.reportFactors.slice(0, 4).map((factor) => (
                  <div key={factor.factor} className="bg-slate-800/30 p-4 rounded-lg border border-slate-600/30 hover:border-emerald-400/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-400/20 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-yellow-300 font-semibold text-sm mb-1">{factor.factor}</div>
                        <div className="text-slate-300 text-sm mb-2">{factor.analysis}</div>
                        <div className="text-emerald-300 text-sm font-medium">→ {factor.recommendation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-emerald-900/20 rounded-lg border border-emerald-400/30">
            <p className="text-emerald-300 text-sm text-center">
              💡 This analysis is generated based on your specific requirements and industry context.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-slate-300 mb-4">
            <div className="text-4xl mb-2">📊</div>
            <p>Your business deployment analysis has been generated based on your industry and responses.</p>
            <p className="text-sm text-slate-400 mt-2">The detailed report will appear here once the analysis is complete.</p>
          </div>
        </div>
      )}
    </div>
  );
});
