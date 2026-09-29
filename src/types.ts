export interface AlertItem {
  id: string;
  title: string;
  source: string;
  legal_ref: string;
  pays: string;
  date: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  secteur: string;
  hazard_category: string;
  summary: string;
  impact: string;
  recommendation: string;
  visipilot_tool?: string;
  url: string;
}
