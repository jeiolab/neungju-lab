export type EraId = 'era1' | 'era2' | 'era3';

export interface Era {
  id: EraId;
  title: string;
  period: string;
  keywords: string[];
  description: string;
  humanRole: string;
  techFocus: string;
  details: string;
}

export interface Card {
  id: string;
  content: string;
  type: 'event' | 'role' | 'tech';
  correctEra: EraId;
  explanation: string; // Used for feedback
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserState {
  name: string;
  score: number;
  completedTabs: string[];
  badges: string[];
  quizHistory: number[]; // Store IDs of wrong answers
  simulationProgress: number; // Percentage
}

export type TabId = 'intro' | 'timeline' | 'simulation' | 'deepdive' | 'quiz' | 'reflection';
