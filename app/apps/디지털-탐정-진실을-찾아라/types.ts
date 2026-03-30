export type TabId = 'concept' | 'simulation' | 'more-info' | 'quiz' | 'debate';

export interface Choice {
  id: string;
  text: string;
  nextStepId?: string | null; // null means end of case
  isCorrect: boolean;
  feedback: string;
  scoreDelta: number;
}

export interface StoryStep {
  id: string;
  text: string;
  image?: string;
  choices: Choice[];
}

export interface Case {
  id: string;
  title: string;
  description: string;
  initialStepId: string;
  steps: Record<string, StoryStep>;
}

export interface QuizQuestion {
  id: string;
  headline: string;
  isTruth: boolean;
  explanation: string;
}

export interface DebateData {
  category: string;
  votes: number;
}

export enum DetectiveLevel {
  ROOKIE = '초보 탐정',
  JUNIOR = '일반 탐정',
  SENIOR = '수석 탐정',
  MASTER = '전설의 명탐정'
}