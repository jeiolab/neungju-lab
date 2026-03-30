export type ViewState = 'dashboard' | 'theory' | 'puzzle' | 'simulation' | 'quiz' | 'dictionary' | 'think';

export interface Stage {
  id: string;
  title: string;
  description: string;
  iconName: string;
  checklistItems: string[];
  correctChecklist: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  relatedConcept: string;
}

export interface DictionaryTerm {
  term: string;
  definition: string;
  category: 'Model' | 'Parameter' | 'Preprocessing' | 'General';
}

export interface UserState {
  score: number;
  completedPuzzle: boolean;
  completedQuiz: boolean;
  puzzleAttempts: number;
  badges: string[];
  weaknessTags: string[];
}

export interface SimulationConfig {
  removeOutliers: boolean;
  testSplitRatio: 20 | 40; // 20% or 40%
}

export interface SimulationResult {
  trainingScore: number;
  testScore: number;
  feedback: string;
  status: 'bad' | 'good' | 'excellent';
}