export type TabType = 'theory' | 'simulation' | 'learnMore' | 'quiz' | 'discussion';

export interface Scenario {
  id: number;
  title: string;
  description: string;
  verdict: 'guilty' | 'innocent'; // guilty = 저작권 침해, innocent = 문제 없음
  explanation: string;
  difficulty: '쉬움' | '보통' | '어려움';
}

export interface QuizQuestion {
  id: number;
  symbol: string; // Icon name or description
  question: string;
  options: string[];
  correctAnswer: number; // Index
}

export interface DiscussionData {
  id: number;
  topic: string;
  description: string;
  agreements: number;
  disagreements: number;
}

export interface CCLConfig {
  attribution: boolean; // BY (Always true essentially)
  nonCommercial: boolean; // NC
  noDerivatives: boolean; // ND
  shareAlike: boolean; // SA
}