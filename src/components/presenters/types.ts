import type { ReportData } from '../../types/report';

export interface ScreenPresenterProps {
  title: string;
  subtitle?: string | undefined;
  helpText: string;
  hoveredOptionLabel?: string | undefined;
  textValue: string;
  showTextPreview: boolean;
  onTextChange: (value: string) => void;
  reportData: ReportData | null;
  isLoading: boolean;
  options: string[];
  industry: string | null;
}
