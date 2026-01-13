export enum Difficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD'
}

export enum StepType {
  DEFINE_PROBLEM = 'DEFINE_PROBLEM',
  EXPLORE_DATA = 'EXPLORE_DATA',
  HANDLE_MISSING = 'HANDLE_MISSING',
  HANDLE_OUTLIERS = 'HANDLE_OUTLIERS',
  REMOVE_DUPLICATES = 'REMOVE_DUPLICATES',
  STANDARDIZE_FORMAT = 'STANDARDIZE_FORMAT',
  INTEGRATE_DATA = 'INTEGRATE_DATA',
  SUMMARIZE = 'SUMMARIZE'
}

export interface DataRow {
  id: number;
  timestamp: string;
  station: string;
  pm25: number | null; // Nullable for missing values
  pm10: number | null;
  status: string;
  isDuplicate?: boolean;
}

export interface ProcessingStep {
  id: string;
  type: StepType;
  label: string;
  description: string;
  options?: string[]; // For micro-options (e.g., 'Mean', 'Drop')
  reasonOptions: string[]; // Options for "Why this step?"
  correctReasonIndex: number;
}

export interface PipelineItem {
  stepId: string;
  stepType: StepType;
  selectedOption?: string; // e.g., 'Delete' for missing
  selectedReasonIndex: number | null;
}

export interface UserProfile {
  name: string;
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  lastPlayed: string | null;
  completedScenarios: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
  conceptTag: string;
}

export interface SimulationResult {
  success: boolean;
  message: string;
  score: number;
  dataStats: {
    initialRows: number;
    finalRows: number;
    missingFixed: number;
    outliersFixed: number;
    duplicatesRemoved: number;
  };
}