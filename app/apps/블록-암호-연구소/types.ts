export enum Tab {
  DIGITAL_LANGUAGE = 'DIGITAL_LANGUAGE',
  XOR_LAB = 'XOR_LAB',
  MODERN_CRYPTO = 'MODERN_CRYPTO',
  QUIZ = 'QUIZ',
  THOUGHTS = 'THOUGHTS'
}

export enum Difficulty {
  EASY = 'EASY', // 4 bits
  MEDIUM = 'MEDIUM', // 6 bits
  HARD = 'HARD' // 8 bits
}

export interface QuizQuestion {
  id: number;
  inputA: number[];
  inputB: number[];
  correctAnswer: number[];
  difficulty: Difficulty;
}

export type Bit = 0 | 1;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
