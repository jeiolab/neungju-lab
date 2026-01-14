export enum TabType {
  MANUAL = 'MANUAL',
  EXAM = 'EXAM',
  SIMULATION = 'SIMULATION',
  NOTE = 'NOTE',
  LICENSE = 'LICENSE'
}

export enum ModuleType {
  PERSONAL_INFO = 'PERSONAL_INFO',
  PROTECTION = 'PROTECTION',
  COPYRIGHT = 'COPYRIGHT'
}

export interface ConceptCard {
  id: string;
  moduleId: ModuleType;
  title: string;
  definition: string;
  keywords: string[];
  misconception: string;
  isRead: boolean;
}

export interface QuizQuestion {
  id: string;
  moduleId: ModuleType;
  question: string;
  type: 'MULTIPLE' | 'OX';
  options?: string[]; // Only for MULTIPLE
  correctAnswer: string; // "O", "X", or option text
  explanation: string; // Corrective feedback (Textbook citation)
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface UserState {
  level: string; // e.g., "훈련병", "이병", ..., "가디언 대장"
  totalScore: number;
  streak: number;
  badges: ModuleType[]; // Unlocked badges
  moduleMastery: Record<ModuleType, number>; // 0-100
  incorrectAnswers: QuizQuestion[];
  completedCardIds: string[]; // To track 10% progress only once
}

export const LEVELS = [
  { name: '훈련병', minScore: 0 },
  { name: '보안 요원', minScore: 100 },
  { name: '가디언', minScore: 300 },
  { name: '가디언 대장', minScore: 600 },
];