export enum Tab {
  CONCEPTS = 'concepts',
  GAME = 'game',
  DEEP_DIVE = 'deep_dive',
  QUIZ = 'quiz',
  APPLICATION = 'application',
}

export enum Axis {
  PUBLIC_INTEREST = 'public_interest',
  CONVENIENCE = 'convenience',
  PRIVACY = 'privacy',
}

export interface PolicyOption {
  id: string;
  category: 'scope' | 'consent' | 'anonymization' | 'access' | 'duration';
  label: string;
  value: number; // Impact score (abstract)
  isIdeal: boolean; // For the specific scenario
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: 'school' | 'community' | 'disaster' | 'data_service';
  idealValues: {
    [Axis.PUBLIC_INTEREST]: number;
    [Axis.CONVENIENCE]: number;
    [Axis.PRIVACY]: number;
  };
  policyOptions: PolicyOption[];
  minThresholds: { // Minimum required values to be functional
     [Axis.PUBLIC_INTEREST]?: number;
     [Axis.CONVENIENCE]?: number;
     [Axis.PRIVACY]?: number;
  };
  feedback: {
    balanced: string;
    tooRisky: string;
    tooRestrictive: string;
  }
}

export interface UserStats {
  level: number;
  score: number;
  badges: string[];
  streak: number;
  decisionStyle: {
    [Axis.PUBLIC_INTEREST]: number;
    [Axis.CONVENIENCE]: number;
    [Axis.PRIVACY]: number;
  };
}

export interface QuizQuestion {
  id: number;
  type: 'objective' | 'short_answer' | 'essay';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[]; // For objective
  correctAnswer?: string; // For objective/short
  explanation?: string;
}
