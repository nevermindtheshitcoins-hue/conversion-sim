import React from 'react';
import { ReportData } from '../types/report';

interface ReportDisplayProps {
  reportData: ReportData;
}

export const ReportDisplay = React.memo(function ReportDisplay({ reportData }: ReportDisplayProps) {
  // Check if we have the new business case structure
  const hasBusinessCase = reportData.businessCase || reportData.executiveSummary;

  return (
    <div className="text-left text-sm bg-booth-panel p-6 rounded-lg overflow-y-auto max-h-96 border-2 border-industrial-steel report-container">
      {reportData.response ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-industrial-orange rounded-full"></div>
            <div className="text-text-primary font-display font-black text-lg tracking-wider">
              {hasBusinessCase ? 'STRATEGIC BUSINESS CASE' : 'DEPLOYMENT ANALYSIS'}
            </div>
          </div>

          {/* Executive Summary */}
          {reportData.executiveSummary && (
            <div className="bg-industrial-charcoal p-5 rounded-lg border-l-4 border-industrial-orange">
              <div className="text-industrial-orange font-display font-black text-xs uppercase tracking-wider mb-2">Executive Summary</div>
              <div className="text-text-primary text-base leading-relaxed font-sans">{reportData.executiveSummary}</div>
            </div>
          )}

          {/* Main Response */}
          <div className="bg-industrial-charcoal p-4 rounded-lg border-l-4 border-industrial-orange/50">
            <div className="text-text-primary whitespace-pre-wrap leading-relaxed">{reportData.response}</div>
          </div>

          {/* Business Case - Value Propositions */}
          {reportData.businessCase?.valuePropositions && reportData.businessCase.valuePropositions.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-industrial-orange rounded-full"></div>
                <div className="text-text-primary font-display font-black text-lg tracking-wider">VALUE PROPOSITIONS</div>
              </div>
              <div className="grid gap-4">
                {reportData.businessCase.valuePropositions.map((vp, idx) => (
                  <div key={idx} className="bg-industrial-charcoal p-4 rounded-lg border-2 border-industrial-steel hover:border-industrial-orange transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-industrial-orange/20 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-industrial-orange rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-industrial-orange font-display font-black text-sm mb-1">{vp.category}</div>
                        <div className="text-text-primary text-sm mb-2">{vp.benefit}</div>
                        <div className="text-industrial-orange text-sm font-sans">📊 {vp.impact}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ROI Projection */}
          {reportData.businessCase?.roiProjection && (
            <div className="mt-6 bg-industrial-charcoal p-5 rounded-lg border-2 border-industrial-steel">
              <div className="text-text-primary font-display font-black text-base mb-3">ROI PROJECTION</div>
              <div className="space-y-3">
                <div className="text-text-primary text-sm">
                  <span className="text-industrial-orange font-display font-black">Time to Value:</span> {reportData.businessCase.roiProjection.timeToValue}
                </div>
                {reportData.businessCase.roiProjection.keyMetrics && reportData.businessCase.roiProjection.keyMetrics.length > 0 && (
                  <div className="space-y-2">
                    {reportData.businessCase.roiProjection.keyMetrics.map((metric, idx) => (
                      <div key={idx} className="bg-industrial-charcoal p-3 rounded border-l-2 border-industrial-orange/50">
                        <div className="text-industrial-orange font-display font-black text-xs mb-1">{metric.metric}</div>
                        <div className="text-text-primary text-xs">
                          <span className="text-text-secondary">Baseline:</span> {metric.baseline} → 
                          <span className="text-industrial-orange font-display font-black"> {metric.projected}</span>
                          <span className="text-text-secondary"> ({metric.timeframe})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-text-primary text-sm italic pt-2 border-t border-industrial-steel">
                  {reportData.businessCase.roiProjection.costBenefit}
                </div>
              </div>
            </div>
          )}

          {/* Risk Mitigation */}
          {reportData.riskMitigation?.addressedRisks && reportData.riskMitigation.addressedRisks.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-8 bg-industrial-orange rounded-full"></div>
                <div className="text-text-primary font-display font-black text-lg tracking-wider">RISK MITIGATION</div>
              </div>
              <div className="space-y-2">
                {reportData.riskMitigation.addressedRisks.map((risk, idx) => (
                  <div key={idx} className="bg-industrial-charcoal p-3 rounded-lg border-l-2 border-industrial-orange/50">
                    <div className="text-industrial-orange font-display font-black text-xs mb-1">⚠️ {risk.risk}</div>
                    <div className="text-text-primary text-xs mb-1">{risk.mitigation}</div>
                    <div className="text-industrial-orange text-xs font-sans">✓ {risk.outcome}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Competitive Positioning */}
          {reportData.competitivePositioning && (
            <div className="mt-6 bg-industrial-charcoal p-4 rounded-lg border-2 border-industrial-steel">
              <div className="text-text-primary font-display font-black text-sm mb-2">COMPETITIVE POSITIONING</div>
              <div className="text-text-primary text-sm leading-relaxed">{reportData.competitivePositioning}</div>
            </div>
          )}

          {/* Next Steps */}
          {reportData.nextSteps && (
            <div className="mt-6 bg-industrial-charcoal p-5 rounded-lg border-2 border-industrial-steel">
              <div className="text-text-primary font-display font-black text-base mb-3">NEXT STEPS</div>
              {reportData.nextSteps.immediateActions && reportData.nextSteps.immediateActions.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {reportData.nextSteps.immediateActions.map((action, idx) => (
                    <li key={idx} className="text-text-primary text-sm flex items-start gap-2">
                      <span className="text-industrial-orange font-display font-black">→</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              )}
              {reportData.nextSteps.callToAction && (
                <div className="pt-3 border-t border-industrial-steel">
                  <div className="text-text-primary font-display font-black text-sm">📞 {reportData.nextSteps.callToAction}</div>
                </div>
              )}
            </div>
          )}

          {/* Legacy Report Factors (fallback) */}
          {!hasBusinessCase && reportData.reportFactors && reportData.reportFactors.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-industrial-orange rounded-full"></div>
                <div className="text-text-primary font-display font-black text-lg tracking-wider">KEY SUCCESS FACTORS</div>
              </div>
              <div className="grid gap-4">
                {reportData.reportFactors.slice(0, 4).map((factor) => (
                  <div key={factor.factor} className="bg-industrial-charcoal p-4 rounded-lg border-2 border-industrial-steel hover:border-industrial-orange transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-industrial-orange/20 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-industrial-orange rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-industrial-orange font-display font-black text-sm mb-1">{factor.factor}</div>
                        <div className="text-text-primary text-sm mb-2">{factor.analysis}</div>
                        <div className="text-industrial-orange text-sm font-sans">→ {factor.recommendation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 p-4 bg-industrial-charcoal rounded-lg border-2 border-industrial-steel">
            <p className="text-text-primary text-sm text-center font-sans">
              💡 This strategic assessment is generated based on your specific organizational context and priorities.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-text-primary mb-4">
            <div className="text-4xl mb-2">📊</div>
            <p>Your strategic business case is being generated based on your responses.</p>
            <p className="text-sm text-text-secondary mt-2">The comprehensive analysis will appear here once complete.</p>
          </div>
        </div>
      )}
    </div>
  );
});
