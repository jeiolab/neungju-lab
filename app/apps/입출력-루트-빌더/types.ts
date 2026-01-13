export type FileMode = 'r' | 'w' | 'a';

export interface FileSystemState {
  [filename: string]: {
    content: string;
    updatedAt: number;
  };
}

export interface Block {
  id: string;
  type: 'input' | 'print' | 'open' | 'write' | 'read' | 'close' | 'variable';
  label: string;
  param?: string; // e.g., 'w', 'data.txt'
}

export interface Level {
  id: number;
  title: string;
  description: string;
  correctSequence: string[]; // Array of Block types or precise IDs
  availableBlocks: Block[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: {
    reason: string;
    correction: string;
    challenge: string;
  };
}

export interface UserState {
  xp: number;
  streak: number;
  badges: string[];
  completedLevels: number[];
  completedQuizzes: number[];
}
