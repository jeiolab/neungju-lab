export type Difficulty = 'easy' | 'medium' | 'hard';

export interface UserProfile {
  level: number;
  xp: number;
  badges: string[];
  streak: number;
  lastLogin: string;
  mastery: Record<string, number>; // conceptId -> score (0-100)
}

export interface SimulationPlan {
  problem: string;
  metrics: string[];
  dataType: 'structured' | 'unstructured';
  method: string;
  duration: number;
  sampleSize: number;
  timeSlots: string[];
  ethics: {
    privacy: boolean;
    copyright: boolean;
    consent: boolean;
  };
  score?: number;
}

export interface QuizQuestion {
  id: string;
  difficulty: Difficulty;
  question: string;
  options?: string[]; // For multiple choice
  type: 'multiple' | 'short' | 'descriptive';
  correctAnswer: number | string | string[]; // Index, exact string, or keywords
  explanation: string; // Why it was wrong / specific feedback
  tags: string[];
}

export interface TheoryCardData {
  id: string;
  title: string;
  definition: string;
  keywords: string[];
  example: string;
  misconception: string;
  correction: string;
  checkQuestion: string;
}

export interface ReflectionEntry {
  id: string;
  type: 'condition' | 'counter' | 'apply';
  question: string;
  answer: string;
  date: string;
}