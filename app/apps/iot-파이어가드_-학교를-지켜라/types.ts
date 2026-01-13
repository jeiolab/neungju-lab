export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  INFO = 'INFO',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION'
}

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface QuizQuestion {
  id: number;
  question: string;
  options?: string[]; // If undefined, it's OX
  answer: string | boolean;
  explanation: string;
}

export interface SensorInfo {
  name: string;
  type: '정온식' | '차동식' | '광전식';
  description: string;
  icon: string;
  usage: string;
}
