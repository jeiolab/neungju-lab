export type LocationType = 'hallway' | 'classroom' | 'restroom';

export interface SimulationParams {
  sensitivity: number; // 0-100
  duration: number; // seconds
  brightness: number; // 0-100
  location: LocationType;
}

export interface SimulationScores {
  energy: number; // 0-100
  convenience: number; // 0-100
  privacy: number; // 0-100
}

export interface Design {
  id: string;
  name: string;
  params: SimulationParams;
  scores: SimulationScores;
  reflection: string; // The proposal text
  timestamp: number;
}

export interface UserProgress {
  level: number;
  xp: number;
  badges: string[];
  streak: number;
  lastLogin: string; // ISO date
  designsCount: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

export interface QuizResult {
  date: number;
  score: number;
  wrongAnswers: number[]; // ids of wrong questions
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}
