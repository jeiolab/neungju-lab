export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  CHECKLIST = 'CHECKLIST',
  QUIZ = 'QUIZ',
  DISCUSSION = 'DISCUSSION'
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ChecklistItem {
  id: string;
  category: 'PC' | 'SMARTPHONE';
  text: string;
  description: string;
  checked: boolean;
}

export interface GeminiResponse {
  feedback: string;
}