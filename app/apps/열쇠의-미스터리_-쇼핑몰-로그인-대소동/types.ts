export enum Tab {
  COMPARISON = 'comparison',
  PUZZLE = 'puzzle',
  HTTPS = 'https',
  QUIZ = 'quiz',
  THINK = 'think',
}

export interface GameState {
  level: number;
  xp: number;
  maxXp: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface PuzzleItem {
  id: string;
  type: 'key' | 'lock' | 'box' | 'message';
  name: string;
  color: string;
  isPublic?: boolean; // For asymmetric keys
  owner?: 'Alice' | 'Bob' | 'Eve';
}
