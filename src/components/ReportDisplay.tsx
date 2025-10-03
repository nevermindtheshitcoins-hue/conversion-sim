import { ReportData } from '../types/report';

interface ReportDisplayProps {
  reportData: ReportData;
}

export function ReportDisplay({ reportData }: ReportDisplayProps) {
  return (
    <div className="text-left text-sm bg-black/20 p-4 rounded-lg overflow-y-auto max-h-80">
      {reportData.response ? (
        <div className="space-y-4">
          <div className="text-yellow-300 font-bold mb-2">DEPLOYMENT ANALYSIS:</div>
          <div className="text-slate-300 whitespace-pre-wrap">{reportData.response}</div>
          
          {reportData.reportFactors && reportData.reportFactors.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="text-emerald-300 font-bold">KEY FACTORS:</div>
              {reportData.reportFactors.slice(0, 4).map((factor, index) => (
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
          Your business deployment analysis has been generated based on your industry and responses.
        </div>
      )}
    </div>
  );
}