export type Difficulty = 'easy' | 'normal' | 'hard';

export type AnswerType = 'Possible' | 'Impossible' | 'Conditional';

export interface Scenario {
  id: number;
  difficulty: Difficulty;
  situation: string; // The story text
  ruleDescription: string; // The rule in plain text
  requiredVariables: string[]; // Variables needed to decide
  providedVariables: Record<string, any>; // Variables given in the scenario
  result: AnswerType;
  logicExpression: string; // The code-like logic expression
  explanation: string; // Detailed explanation
}

export interface QuizQuestion {
  id: number;
  difficulty: Difficulty;
  question: string;
  options?: string[]; // For multiple choice
  type: 'multiple' | 'short' | 'essay';
  correctAnswer: string; // For auto-grading
  explanation: string;
}

export interface UserStats {
  points: number;
  level: number;
  badges: string[];
  streak: number;
  lastPlayedDate: string;
  mastery: {
    comparison: number;
    logic: number;
    membership: number; // 'in' operator
  };
  wrongNotes: number[]; // IDs of wrong quiz questions
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}