export enum AnalysisType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  COMPARE = 'COMPARE',
  DASHBOARD = 'DASHBOARD'
}

export interface TextAnalysisResult {
  sentimentScore: number; // 0 to 100
  sentimentLabel: 'Positive' | 'Negative' | 'Neutral';
  tokens: string[];
  keywords: string[];
  explanation: string;
}

export interface ImageAnalysisResult {
  tags: string[];
  description: string;
  features: string; // Explanation of extracted features
}

export interface HistoryItem {
  type: 'text' | 'image';
  content: string; // text string or image label
  timestamp: number;
}
