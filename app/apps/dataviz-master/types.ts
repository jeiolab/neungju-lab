export enum ChartType {
  BAR = 'Bar',
  LINE = 'Line',
  PIE = 'Pie',
  WORD_CLOUD = 'WordCloud'
}

export interface DataPoint {
  name: string;
  value: number;
  // Optional color override for specific visualizers
  color?: string;
}

export interface Mission {
  id: string;
  title: string;
  clientRequest: string;
  description: string;
  data: DataPoint[];
  correctCharts: ChartType[];
  bestChart: ChartType;
  hint: string;
  // Context for AI to generate insight
  dataContext: string; 
}

export interface InsightResponse {
  analysis: string;
  tone: 'encouraging' | 'neutral' | 'cautionary';
}
