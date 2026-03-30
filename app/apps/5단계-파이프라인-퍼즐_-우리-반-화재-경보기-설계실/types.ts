export type TabId = 'concepts' | 'simulation' | 'more' | 'quiz' | 'thoughts';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProgress {
  level: number;
  xp: number;
  badges: Badge[];
  streak: number;
  lastActiveDate: string;
}

export interface ConceptMastery {
  [conceptId: string]: number; // 0 to 100
}

export interface WrongNote {
  qid: string;
  conceptId: string;
  misconceptionType: string;
  difficulty: 'easy' | 'medium' | 'hard';
  userAns: string;
  correctAns: string;
  ts: number;
}

export interface PipelineBlock {
  id: string;
  label: string;
  type: 'sensor' | 'comm_send' | 'comm_recv' | 'process' | 'output';
  description: string;
}

export interface Question {
  id: string;
  question: string;
  options?: string[]; // Multiple choice
  type: 'multiple' | 'short';
  answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  conceptId: string;
  misconceptionType: string;
}

export interface Concept {
  id: string;
  title: string;
  definition: string;
  keywords: string[];
  example: string;
  misconception: string;
  correction: string;
  checkQuestion: {
    q: string;
    options: string[];
    a: number; // index
  };
}