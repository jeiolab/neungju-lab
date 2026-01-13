export enum EncryptionCategory {
  SUBSTITUTION = '치환 암호',
  TRANSPOSITION = '전치 암호',
  HASH = '단방향 (해시)',
  SYMMETRIC = '대칭키 암호',
  ASYMMETRIC = '비대칭키 (공개키)',
  DIGITAL_SIGNATURE = '디지털 서명',
  HTTPS = 'HTTPS',
}

export interface ScenarioCard {
  id: string;
  title: string;
  description: string;
  category: EncryptionCategory;
  difficulty: 'easy' | 'hard';
  keywords: string[]; // For fallback checking
  explanation: string; // Correct explanation
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // Index of correct option
  explanation: string;
}

export interface StoryCard {
  id: string;
  title: string;
  content: string;
  era: string;
}

export type UserLevel = '인턴 감별사' | '주니어 감별사' | '시니어 감별사';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  categoryRequirement?: EncryptionCategory;
}

export interface Misconception {
  id: string;
  scenarioTitle: string;
  userCategory: string;
  correctCategory: string;
  timestamp: number;
}

export interface UserState {
  score: number;
  level: UserLevel;
  badges: Badge[];
  misconceptions: Misconception[];
  completedScenarios: string[];
}