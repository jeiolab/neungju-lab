export type ViewState = 'INTRO' | 'CONCEPTS' | 'SIMULATION' | 'QUIZ' | 'RESULT';

export type NetworkType = 'WIRED' | 'WIRELESS';

export interface ConceptData {
  type: NetworkType;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  examples: string[];
}

export interface Scenario {
  id: number;
  title: string;
  situation: string;
  correctAnswer: NetworkType;
  explanation: string;
  iconType: 'GAME' | 'PARK' | 'OFFICE' | 'HOME';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}