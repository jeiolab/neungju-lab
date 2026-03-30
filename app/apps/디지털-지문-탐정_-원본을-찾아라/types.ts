export enum Tab {
  CONCEPT = 'CONCEPT',
  GENERATOR = 'GENERATOR',
  BLOCKCHAIN = 'BLOCKCHAIN',
  QUIZ = 'QUIZ',
  DISCUSSION = 'DISCUSSION',
}

export interface BlockData {
  id: number;
  nonce: number;
  data: string;
  prevHash: string;
  hash: string;
  isValid: boolean;
}

export interface QuizQuestion {
  id: number;
  title: string;
  scenario: string;
  originalHash: string;
  options: {
    id: string;
    label: string;
    content: string; // Simulated content or filename
    isCorrect: boolean;
  }[];
}

export interface HashComparisonResult {
  hash1: string;
  hash2: string;
  match: boolean;
  diffIndex: number; // First index where they differ, -1 if match
}