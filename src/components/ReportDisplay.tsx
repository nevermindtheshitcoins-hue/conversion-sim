import React from 'react';
import { ReportData } from '../types/report';

interface ReportDisplayProps {
  reportData: ReportData;
}

export const ReportDisplay = React.memo(function ReportDisplay({ reportData }: ReportDisplayProps) {
  // Check if we have the new business case structure
  const hasBusinessCase = reportData.businessCase || reportData.executiveSummary;

  return (
    <div className="text-left text-sm bg-gradient-to-br from-black/30 to-slate-900/30 p-6 rounded-xl overflow-y-auto max-h-96 border border-emerald-400/20 shadow-lg report-container">
      {reportData.response ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-emerald-400 rounded-full"></div>
            <div className="text-yellow-300 font-bold text-lg tracking-wide">
              {hasBusinessCase ? 'STRATEGIC BUSINESS CASE' : 'DEPLOYMENT ANALYSIS'}
            </div>
          </div>

          {/* Executive Summary */}
          {reportData.executiveSummary && (
            <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 p-5 rounded-lg border-l-4 border-emerald-400">
              <div className="text-emerald-300 font-semibold text-xs uppercase tracking-wider mb-2">Executive Summary</div>
              <div className="text-slate-100 text-base leading-relaxed font-medium">{reportData.executiveSummary}</div>
            </div>
          )}

          {/* Main Response */}
          <div className="bg-slate-800/40 p-4 rounded-lg border-l-4 border-emerald-400/50">
            <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">{reportData.response}</div>
          </div>

          {/* Business Case - Value Propositions */}
          {reportData.businessCase?.valuePropositions && reportData.businessCase.valuePropositions.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-yellow-400 rounded-full"></div>
                <div className="text-emerald-300 font-bold text-lg tracking-wide">VALUE PROPOSITIONS</div>
              </div>
              <div className="grid gap-4">
                {reportData.businessCase.valuePropositions.map((vp, idx) => (
                  <div key={idx} className="bg-slate-800/30 p-4 rounded-lg border border-slate-600/30 hover:border-emerald-400/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-400/20 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-yellow-300 font-semibold text-sm mb-1">{vp.category}</div>
                        <div className="text-slate-300 text-sm mb-2">{vp.benefit}</div>
                        <div className="text-emerald-300 text-sm font-medium">📊 {vp.impact}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ROI Projection */}
          {reportData.businessCase?.roiProjection && (
            <div className="mt-6 bg-gradient-to-br from-blue-900/20 to-emerald-900/20 p-5 rounded-lg border border-blue-400/30">
              <div className="text-blue-300 font-bold text-base mb-3">ROI PROJECTION</div>
              <div className="space-y-3">
                <div className="text-slate-200 text-sm">
                  <span className="text-emerald-300 font-semibold">Time to Value:</span> {reportData.businessCase.roiProjection.timeToValue}
                </div>
                {reportData.businessCase.roiProjection.keyMetrics && reportData.businessCase.roiProjection.keyMetrics.length > 0 && (
                  <div className="space-y-2">
                    {reportData.businessCase.roiProjection.keyMetrics.map((metric, idx) => (
                      <div key={idx} className="bg-slate-800/40 p-3 rounded border-l-2 border-blue-400/50">
                        <div className="text-yellow-300 font-semibold text-xs mb-1">{metric.metric}</div>
                        <div className="text-slate-300 text-xs">
                          <span className="text-slate-400">Baseline:</span> {metric.baseline} → 
                          <span className="text-emerald-300 font-semibold"> {metric.projected}</span>
                          <span className="text-slate-400"> ({metric.timeframe})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-slate-300 text-sm italic pt-2 border-t border-slate-700/50">
                  {reportData.businessCase.roiProjection.costBenefit}
                </div>
              </div>
            </div>
          )}

          {/* Risk Mitigation */}
          {reportData.riskMitigation?.addressedRisks && reportData.riskMitigation.addressedRisks.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-8 bg-red-400 rounded-full"></div>
                <div className="text-red-300 font-bold text-lg tracking-wide">RISK MITIGATION</div>
              </div>
              <div className="space-y-2">
                {reportData.riskMitigation.addressedRisks.map((risk, idx) => (
                  <div key={idx} className="bg-slate-800/30 p-3 rounded-lg border-l-2 border-red-400/50">
                    <div className="text-red-300 font-semibold text-xs mb-1">⚠️ {risk.risk}</div>
                    <div className="text-slate-300 text-xs mb-1">{risk.mitigation}</div>
                    <div className="text-emerald-300 text-xs">✓ {risk.outcome}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Competitive Positioning */}
          {reportData.competitivePositioning && (
            <div className="mt-6 bg-purple-900/20 p-4 rounded-lg border border-purple-400/30">
              <div className="text-purple-300 font-bold text-sm mb-2">COMPETITIVE POSITIONING</div>
              <div className="text-slate-200 text-sm leading-relaxed">{reportData.competitivePositioning}</div>
            </div>
          )}

          {/* Next Steps */}
          {reportData.nextSteps && (
            <div className="mt-6 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 p-5 rounded-lg border border-emerald-400/40">
              <div className="text-emerald-300 font-bold text-base mb-3">NEXT STEPS</div>
              {reportData.nextSteps.immediateActions && reportData.nextSteps.immediateActions.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {reportData.nextSteps.immediateActions.map((action, idx) => (
                    <li key={idx} className="text-slate-200 text-sm flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">→</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              )}
              {reportData.nextSteps.callToAction && (
                <div className="pt-3 border-t border-emerald-400/30">
                  <div className="text-cyan-300 font-semibold text-sm">📞 {reportData.nextSteps.callToAction}</div>
                </div>
              )}
            </div>
          )}

          {/* Legacy Report Factors (fallback) */}
          {!hasBusinessCase && reportData.reportFactors && reportData.reportFactors.length > 0 && (
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

          {/* Footer */}
          <div className="mt-6 p-4 bg-emerald-900/20 rounded-lg border border-emerald-400/30">
            <p className="text-emerald-300 text-sm text-center">
              💡 This strategic assessment is generated based on your specific organizational context and priorities.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-slate-300 mb-4">
            <div className="text-4xl mb-2">📊</div>
            <p>Your strategic business case is being generated based on your responses.</p>
            <p className="text-sm text-slate-400 mt-2">The comprehensive analysis will appear here once complete.</p>
          </div>
        </div>
      )}
    </div>
  );
});
