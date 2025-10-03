export interface ReportFactor {
  factor: string;
  analysis: string;
  recommendation: string;
}

export interface ReportData {
  response: string;
  reportFactors?: ReportFactor[];
}