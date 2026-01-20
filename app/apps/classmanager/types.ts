export interface Student {
  id: number;
  name: string;
  // Scores correspond to [Korean, English, Math]
  scores: number[]; 
}

export enum Subject {
  KOREAN = '국어',
  ENGLISH = '영어',
  MATH = '수학',
}

export interface CellPosition {
  rowIndex: number;
  colIndex: number;
}

export type Tab = 'theory' | 'simulation' | 'quiz' | 'more' | 'coach';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}