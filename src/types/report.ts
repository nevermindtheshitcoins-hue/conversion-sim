export interface ReportSection {
  heading: string;
  paragraphs: string[];
  pullQuote?: string;
}

export interface ValueProposition {
  category: string;
  benefit: string;
  impact: string;
}

export interface ROIKeyMetric {
  metric: string;
  baseline: string;
  projected: string;
  timeframe: string;
}

export interface ROIProjection {
  timeToValue: string;
  keyMetrics?: ROIKeyMetric[];
  costBenefit: string;
}

export interface BusinessCase {
  strategicImperative?: string;
  valuePropositions?: ValueProposition[];
  roiProjection?: ROIProjection;
}

export interface PilotDesign {
  scope?: string;
  stakeholders?: string[];
  deploymentModel?: 'private' | 'public' | 'hybrid' | string;
  timeline?: string;
  successCriteria?: string[];
}

export interface AddressedRisk {
  risk: string;
  mitigation: string;
  outcome: string;
}

export interface RiskMitigation {
  addressedRisks?: AddressedRisk[];
}

export interface NextSteps {
  immediateActions?: string[];
  callToAction?: string;
}

export interface ReportFactor {
  factor: string;
  analysis: string;
  recommendation: string;
}

export interface ReportData {
  // Core narrative fields
  response?: string;
  executiveSummary?: string;
  businessCase?: BusinessCase;
  pilotDesign?: PilotDesign;
  riskMitigation?: RiskMitigation;
  competitivePositioning?: string;
  nextSteps?: NextSteps;
  reportFactors?: ReportFactor[];

  // Newspaper-style presentation fields
  headline?: string;
  lede?: string;
  byline?: string;
  dateline?: string;
  sections?: ReportSection[];
  cta?: {
    label: string;
    url: string;
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function isValuePropositionArray(value: unknown): value is ValueProposition[] {
  return (
    Array.isArray(value) &&
    value.every(
      item =>
        item &&
        typeof item === 'object' &&
        typeof item.category === 'string' &&
        typeof item.benefit === 'string' &&
        typeof item.impact === 'string'
    )
  );
}

function isROIKeyMetricArray(value: unknown): value is ROIKeyMetric[] {
  return (
    Array.isArray(value) &&
    value.every(
      item =>
        item &&
        typeof item === 'object' &&
        typeof item.metric === 'string' &&
        typeof item.baseline === 'string' &&
        typeof item.projected === 'string' &&
        typeof item.timeframe === 'string'
    )
  );
}

function isReportSectionArray(value: unknown): value is ReportSection[] {
  return (
    Array.isArray(value) &&
    value.every(
      item =>
        item &&
        typeof item === 'object' &&
        typeof item.heading === 'string' &&
        isStringArray(item.paragraphs) &&
        (item.pullQuote === undefined || typeof item.pullQuote === 'string')
    )
  );
}

function isReportFactorArray(value: unknown): value is ReportFactor[] {
  return (
    Array.isArray(value) &&
    value.every(
      item =>
        item &&
        typeof item === 'object' &&
        typeof item.factor === 'string' &&
        typeof item.analysis === 'string' &&
        typeof item.recommendation === 'string'
    )
  );
}

function isRiskMitigation(value: unknown): value is RiskMitigation {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as RiskMitigation;
  if (candidate.addressedRisks === undefined) {
    return true;
  }

  return (
    Array.isArray(candidate.addressedRisks) &&
    candidate.addressedRisks.every(
      risk =>
        risk &&
        typeof risk === 'object' &&
        typeof risk.risk === 'string' &&
        typeof risk.mitigation === 'string' &&
        typeof risk.outcome === 'string'
    )
  );
}

function isBusinessCase(value: unknown): value is BusinessCase {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as BusinessCase;
  if (candidate.strategicImperative !== undefined && typeof candidate.strategicImperative !== 'string') {
    return false;
  }

  if (candidate.valuePropositions !== undefined && !isValuePropositionArray(candidate.valuePropositions)) {
    return false;
  }

  if (candidate.roiProjection !== undefined) {
    const roi = candidate.roiProjection;
    if (!roi || typeof roi !== 'object') {
      return false;
    }
    if (typeof roi.timeToValue !== 'string' || typeof roi.costBenefit !== 'string') {
      return false;
    }
    if (roi.keyMetrics !== undefined && !isROIKeyMetricArray(roi.keyMetrics)) {
      return false;
    }
  }

  return true;
}

function isPilotDesign(value: unknown): value is PilotDesign {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as PilotDesign;
  if (candidate.scope !== undefined && typeof candidate.scope !== 'string') {
    return false;
  }
  if (candidate.stakeholders !== undefined && !isStringArray(candidate.stakeholders)) {
    return false;
  }
  if (candidate.deploymentModel !== undefined && typeof candidate.deploymentModel !== 'string') {
    return false;
  }
  if (candidate.timeline !== undefined && typeof candidate.timeline !== 'string') {
    return false;
  }
  if (candidate.successCriteria !== undefined && !isStringArray(candidate.successCriteria)) {
    return false;
  }

  return true;
}

function isNextSteps(value: unknown): value is NextSteps {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as NextSteps;
  if (candidate.immediateActions !== undefined && !isStringArray(candidate.immediateActions)) {
    return false;
  }
  if (candidate.callToAction !== undefined && typeof candidate.callToAction !== 'string') {
    return false;
  }

  return true;
}

export function isReportData(payload: unknown): payload is ReportData {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const candidate = payload as ReportData;

  if (candidate.response !== undefined && typeof candidate.response !== 'string') {
    return false;
  }
  if (candidate.executiveSummary !== undefined && typeof candidate.executiveSummary !== 'string') {
    return false;
  }
  if (candidate.businessCase !== undefined && !isBusinessCase(candidate.businessCase)) {
    return false;
  }
  if (candidate.pilotDesign !== undefined && !isPilotDesign(candidate.pilotDesign)) {
    return false;
  }
  if (candidate.riskMitigation !== undefined && !isRiskMitigation(candidate.riskMitigation)) {
    return false;
  }
  if (candidate.competitivePositioning !== undefined && typeof candidate.competitivePositioning !== 'string') {
    return false;
  }
  if (candidate.nextSteps !== undefined && !isNextSteps(candidate.nextSteps)) {
    return false;
  }
  if (candidate.reportFactors !== undefined && !isReportFactorArray(candidate.reportFactors)) {
    return false;
  }
  if (candidate.headline !== undefined && typeof candidate.headline !== 'string') {
    return false;
  }
  if (candidate.lede !== undefined && typeof candidate.lede !== 'string') {
    return false;
  }
  if (candidate.byline !== undefined && typeof candidate.byline !== 'string') {
    return false;
  }
  if (candidate.dateline !== undefined && typeof candidate.dateline !== 'string') {
    return false;
  }
  if (candidate.sections !== undefined && !isReportSectionArray(candidate.sections)) {
    return false;
  }
  if (candidate.cta !== undefined) {
    const cta = candidate.cta;
    if (!cta || typeof cta !== 'object') {
      return false;
    }
    if (typeof cta.label !== 'string' || typeof cta.url !== 'string') {
      return false;
    }
  }

  return true;
}
