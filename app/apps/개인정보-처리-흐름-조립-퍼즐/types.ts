export interface PuzzleBlock {
  id: string;
  label: string;
  description: string;
  category: 'plan' | 'collect' | 'manage' | 'destroy';
}

export interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'subjective';
  question: string;
  options?: string[];
  correctAnswer?: number; // index for multiple choice
  explanation?: string; // static explanation for multiple choice
  modelAnswer?: string; // key points for subjective
}

export interface ConceptCardData {
  title: string;
  content: string;
  iconName: string;
  category: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  LEARN = 'LEARN',
  PUZZLE = 'PUZZLE',
  SIMULATION = 'SIMULATION',
  QUIZ = 'QUIZ'
}

export interface SimulationState {
  retentionPeriod: '1month' | '1year' | 'indefinite';
  hasEncryption: boolean;
  hasAccessControl: boolean;
  isPseudonymized: boolean;
}