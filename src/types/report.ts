export interface ReportFactor {
  factor: string;
  analysis: string;
  recommendation: string;
}

export interface ValueProposition {
  category: string;
  benefit: string;
  impact: string;
}

export interface ROIMetric {
  metric: string;
  baseline: string;
  projected: string;
  timeframe: string;
}

export interface ROIProjection {
  timeToValue: string;
  keyMetrics: ROIMetric[];
  costBenefit: string;
}

export interface BusinessCase {
  strategicImperative: string;
  valuePropositions: ValueProposition[];
  roiProjection: ROIProjection;
}

export interface PilotDesign {
  scope: string;
  stakeholders: string[];
  deploymentModel: string;
  timeline: string;
  successCriteria: string[];
}

export interface AddressedRisk {
  risk: string;
  mitigation: string;
  outcome: string;
}

export interface RiskMitigation {
  addressedRisks: AddressedRisk[];
}

export interface NextSteps {
  immediateActions: string[];
  callToAction: string;
}

export interface ReportData {
  response: string;
  reportFactors?: ReportFactor[];
  // New business case structure
  executiveSummary?: string;
  businessCase?: BusinessCase;
  pilotDesign?: PilotDesign;
  riskMitigation?: RiskMitigation;
  competitivePositioning?: string;
  nextSteps?: NextSteps;
}