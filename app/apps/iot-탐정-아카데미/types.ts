export type TabType = 'concepts' | 'simulation' | 'deepdive' | 'quiz' | 'reflection';

export interface ConceptCard {
  id: string;
  title: string;
  category: '센서' | '네트워크' | '인터페이스' | '처리';
  frontContent: string;
  backDefinition: string;
  backExample: string;
  backMythFact: string;
}

export interface QuizQuestion {
  id: number;
  type: 'OX' | 'MULTIPLE';
  question: string;
  options?: string[];
  correctAnswer: string | number; // For OX, 'O' or 'X'. For Multiple, index (0-3).
  explanation: string;
}

export interface UserState {
  name: string;
  isRegistered: boolean;
  streak: number;
  lastLoginDate: string | null;
  completedConcepts: string[]; // IDs of flipped cards
  badges: string[];
  quizScore: number;
  wrongAnswers: number[]; // IDs of wrong questions
}

export enum BadgeType {
  NEWBIE = '신입 탐정',
  CLUE_FINDER = '단서 수집가', // Read all concepts
  MASTER_DETECTIVE = '수석 탐정', // Perfect Quiz Score
}