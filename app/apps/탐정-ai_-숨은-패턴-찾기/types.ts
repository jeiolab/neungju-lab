export interface Point {
  id: string;
  x: number;
  y: number;
  clusterId: number | null;
  color?: string;
}

export interface Centroid {
  id: number;
  x: number;
  y: number;
  color: string;
}

export interface Article {
  id: string;
  title: string;
  category: 'sports' | 'politics' | 'entertainment';
  x: number;
  y: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: '하' | '중' | '상';
}

export enum Tab {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  REAL_WORLD = 'real_world',
  QUIZ = 'quiz',
  DISCUSSION = 'discussion'
}