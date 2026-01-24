export type Difficulty = 'easy' | 'medium' | 'hard';
export type MasteryLevel = 'low' | 'medium' | 'high';

export interface ConceptCard {
  id: string;
  title: string;
  definition: string; // 한 줄 정의
  keywords: string[]; // 키워드 3개
  example: string; // 예시 1개
  misconception: string; // 흔한 오해
  correction: string; // 교정
  checkQuestion: string; // 10초 체크 질문
}

export interface QuizQuestion {
  id: string;
  conceptId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
}

export interface WrongNoteItem {
  questionId: string;
  userAnswer: number;
  timestamp: number;
  conceptId: string;
  difficulty: Difficulty;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  condition: (state: UserState) => boolean;
}

export interface UserState {
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  masteryMap: Record<string, number>; // conceptId -> 0~100 score
  wrongNote: WrongNoteItem[];
  badges: string[]; // earned badge ids
  quizHistory: { timestamp: number; score: number; difficulty: Difficulty }[];
}

export interface CaseStudy {
  id: string;
  title: string;
  scenario: string;
  tags: ('안전' | '편리' | '위험')[];
  feedback: string;
}

export const STORAGE_KEY = 'netshare_mastery_v1';