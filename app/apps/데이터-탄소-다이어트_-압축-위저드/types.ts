export enum AppView {
  HOME = 'HOME',
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  WIZARD = 'WIZARD',
  CHECKLIST = 'CHECKLIST',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION',
  MY_PAGE = 'MY_PAGE',
}

export enum CompressionType {
  LOSSLESS = '무손실 (Lossless)',
  LOSSY = '손실 (Lossy)',
  HYBRID = '혼합 (Hybrid)',
}

export interface ProjectDraft {
  id: string;
  timestamp: number;
  goal: string;
  targetData: string;
  currentHabits: string[];
  strategy: CompressionType;
  strategyReason: string[];
  executionPlan: string; // 3 lines combined
  expectedEffect: string;
  aiFeedback?: string;
}

export interface QuizQuestion {
  id: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserState {
  streak: number;
  lastLogin: string;
  badges: string[];
  checklist: boolean[];
  quizMastery: Record<number, boolean>; // questionId -> isCorrect
  wrongNotes: number[]; // questionIds
}

export interface SimulationData {
  fileType: string;
  originalSize: number; // relative unit (e.g., 100)
  compressedSize: number;
  method: string;
  description: string;
  qualityImpact: string;
}

export const STORAGE_KEYS = {
  PROJECT_DRAFTS: 'app6_projectDrafts',
  CHECKLIST: 'app6_checklist',
  MASTERY: 'app6_masteryMap',
  WRONG_NOTES: 'app6_wrongNotes',
  STREAK: 'app6_streak',
  BADGES: 'app6_badges',
  LAST_LOGIN: 'app6_lastLogin',
};