export enum TabType {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  MORE_INFO = 'MORE_INFO',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION',
}

export enum ClassificationType {
  SHARE = 'SHARE',
  PROTECT = 'PROTECT',
  CONDITIONAL = 'CONDITIONAL',
}

export interface ConceptCardData {
  id: string;
  title: string;
  definition: string;
  keywords: string[];
  example: string;
  misconception: string;
  question: string;
}

export interface GameCard {
  id: number;
  content: string;
  type: ClassificationType;
  reason: string;
  keywords: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptId: string; // Relates to ConceptCardData
  difficulty: '쉬움' | '보통' | '도전';
}

export interface UserState {
  xp: number;
  level: number;
  streak: number;
  lastLogin: string;
  badges: string[];
  quizHistory: Record<string, boolean>; // questionId -> isCorrect
  wrongNotes: number[]; // question IDs
  completedReflections: number;
}

export interface ReflectionEntry {
  id: string;
  topic: string;
  content: string; // Masked content
  date: string;
}

export const STORAGE_KEY = 'infoShareProtect_app1_v1_userState';
export const REFLECTIONS_KEY = 'infoShareProtect_app1_v1_reflections';
