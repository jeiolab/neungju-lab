export interface HuffmanNode {
  id: string;
  char: string | null; // null for internal nodes
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  code?: string;
  isLeaf: boolean;
}

export interface QuizQuestion {
  id: number;
  type: 'OX' | 'MULTIPLE' | 'SHORT';
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  question: string;
  options?: string[];
  answer: string | number;
  explanation: string;
}

export interface UserStats {
  completedTrees: number;
  totalSavings: number; // accumulated percentage
  mastery: Record<number, boolean>; // quiz id -> correct
  badges: string[];
  streak: number;
  lastLogin: string;
}

export interface Reflection {
  id: string;
  question: string;
  userAnswer: string;
  isCompleted: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}
