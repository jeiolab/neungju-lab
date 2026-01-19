export enum Tab {
  CONCEPT = 'CONCEPT',
  SIMULATION = 'SIMULATION',
  QUIZ = 'QUIZ',
  THOUGHT = 'THOUGHT',
  MORE = 'MORE'
}

export interface Shape {
  id: number;
  type: 'circle' | 'triangle' | 'square';
  color: 'red' | 'blue';
  x: number;
  y: number;
}

export interface QuizQuestion {
  id: number;
  difficulty: '하' | '중' | '상';
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
  hint: string;
}

export interface QuizResult {
  questionId: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface ThoughtEntry {
  id: string;
  question: string;
  answer: string;
  feedback: string;
  date: string;
}
