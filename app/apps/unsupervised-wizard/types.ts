export enum ProjectTheme {
  STUDY = 'STUDY',
  ENV = 'ENV',
  LIBRARY = 'LIBRARY'
}

export enum MethodType {
  CLUSTERING = 'Clustering',
  OUTLIER = 'Outlier Detection',
  DENSITY = 'Density Estimation'
}

export interface WizardData {
  theme: ProjectTheme;
  problem: string;
  attributes: string[];
  method: MethodType;
  successCriteria: string[];
  interpretation: string;
}

export interface UserProgress {
  score: number;
  badges: string[];
  streak: number;
  completedSteps: number; // 0-5
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export type Tab = 'theory' | 'wizard' | 'simulation' | 'gallery' | 'quiz' | 'critical';
