export type View = 'HOME' | 'THEORY' | 'PIPELINE_PUZZLE' | 'MERGE_GAME' | 'QUIZ' | 'DASHBOARD';

export interface UserStats {
  xp: number;
  level: number;
  completedPuzzles: number;
  mergeGameWins: number;
  consecutiveMerges: number;
  badges: string[];
  quizHistory: QuizRecord[];
}

export interface QuizRecord {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  date: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string; // The text of the correct answer
  explanation: string;
}

export interface OrderItem {
  id: number;
  name: string; // e.g., "떡볶이(105)"
  value: number; // for sorting
}

// Pipeline Puzzle Types
export type PipelineStepType = 'SPLIT' | 'SORT_LEFT' | 'SORT_RIGHT' | 'MERGE' | 'BASE_CASE';

export interface PipelineStep {
  id: string;
  label: string;
  type: PipelineStepType;
  description: string;
}
