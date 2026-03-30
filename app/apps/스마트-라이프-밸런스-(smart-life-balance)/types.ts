export enum Tab {
  THEORY = 'THEORY',
  GAME = 'GAME',
  CASES = 'CASES',
  QUIZ = 'QUIZ',
  DEBATE = 'DEBATE'
}

export interface Scenario {
  id: number;
  title: string;
  description: string;
  choiceA: {
    text: string;
    convenienceChange: number;
    privacyChange: number;
  };
  choiceB: {
    text: string;
    convenienceChange: number;
    privacyChange: number;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CaseStudy {
  id: number;
  title: string;
  icon: string;
  summary: string;
  pros: string[];
  cons: string[];
}

export interface DebateEntry {
  id: string;
  topic: string;
  userOpinion: string;
  aiFeedback?: string;
  timestamp: number;
}

export type EndingType = 'INVISIBLE' | 'OPEN_DOOR' | 'SMART_CITIZEN';

export interface GameState {
  currentScenarioIndex: number;
  convenienceScore: number;
  privacyScore: number;
  isGameOver: boolean;
  history: {
    scenarioId: number;
    choice: 'A' | 'B';
    consequence: string;
  }[];
}