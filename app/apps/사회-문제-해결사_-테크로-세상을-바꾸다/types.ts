export enum BlockType {
  SENSOR = 'SENSOR',
  NETWORK = 'NETWORK',
  PROCESS = 'PROCESS',
  ACTION = 'ACTION',
  NOISE = 'NOISE' // For difficulty
}

export interface Block {
  id: string;
  name: string;
  type: BlockType;
  icon: string;
  description: string;
}

export interface Problem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  difficulty: 'easy' | 'hard';
  correctSequence: string[]; // Array of Block IDs
  availableBlocks: Block[]; // Pool of blocks to choose from
  successMessage: string;
  socialValue: string;
  quiz: Quiz;
}

export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type Tab = 'intro' | 'build' | 'success' | 'quiz' | 'idea';

export interface UserState {
  solvedProblems: string[];
  badges: string[];
}