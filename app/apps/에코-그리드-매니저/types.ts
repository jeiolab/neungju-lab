export type TabId = 'concepts' | 'simulation' | '3d' | 'quiz' | 'design';

export interface UserState {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  lastPlayed: string | null;
  quizScore: number;
}

export interface Cell {
  row: number;
  col: number;
  amount: number; // 0-5
  type: 'general' | 'recyclable';
}

export interface GridConfig {
  rows: number;
  cols: number;
}

export interface SimStats {
  environment: number; // 0-100
  time: number; // 0-100
  accuracy: number; // 0-100
}

export interface PathNode {
  row: number;
  col: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export enum BadgeType {
  STRATEGIST = "균형 잡힌 전략가",
  ECO_MASTER = "환경 마스터",
  SPEED_RACER = "스피드 레이서",
  DATA_ARCHITECT = "데이터 설계자"
}