export interface Product {
  id: number;
  name: string;
  price: number;
  sales: number;
}

export interface QueryResult {
  type: 'text' | 'number' | 'list';
  label: string;
  value: string | number;
  details?: string;
  highlightIds?: number[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-based
  explanation: string;
}