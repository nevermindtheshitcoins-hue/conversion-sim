import type { ReportData } from '../../types/report';

export interface ScreenPresenterProps {
  title: string;
  subtitle?: string;
  helpText: string;
  hoveredOptionLabel?: string;
  textValue: string;
  showTextPreview: boolean;
  reportData: ReportData | null;
  isLoading: boolean;
  options: string[];
  industry: string | null;
}
