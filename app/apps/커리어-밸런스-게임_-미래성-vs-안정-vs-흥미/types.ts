export type ViewMode = 'home' | 'theory' | 'simulation' | 'quiz' | 'reflection' | 'cases' | 'profile';

export interface Job {
  id: string;
  title: string;
  category: string;
  description: string;
  future: number;   // 1-10
  stability: number; // 1-10
  interest: number;  // 1-10 (Generic intrinsic interest/fun factor)
  skills: string[];
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastLogin: string; // ISO date
  badges: string[];
}

export interface SimulationResult {
  id: string;
  timestamp: string;
  situation: string;
  weights: { future: number; stability: number; interest: number };
  selectedJobs: string[]; // Job IDs
  topMatchId: string;
  score: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TheoryCard {
  title: string;
  content: string;
  icon: string;
}

export interface CaseStudy {
  title: string;
  domain: string;
  description: string;
  tech: string;
}