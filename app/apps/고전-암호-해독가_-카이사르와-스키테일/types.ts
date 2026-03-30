export enum Tab {
  PRINCIPLES = 'principles',
  CAESAR = 'caesar',
  SCYTALE = 'scytale',
  QUIZ = 'quiz',
  ANALYSIS = 'analysis'
}

export interface QuizQuestion {
  id: number;
  type: 'caesar' | 'scytale';
  question: string;
  cipherText: string;
  key: number; // Shift for Caesar, Diameter for Scytale
  answer: string;
  hint: string;
}

export interface HistoryMessage {
  role: 'user' | 'model';
  text: string;
}