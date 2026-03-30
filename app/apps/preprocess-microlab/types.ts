export interface StudentData {
  id: number;
  height: number | null; // null represents missing
  size: string | null;   // null represents missing
  satisfaction: number;
}

export enum MissingValueStrategy {
  DROP = 'DROP',
  MEAN = 'MEAN',
  MEDIAN = 'MEDIAN',
  MODE = 'MODE'
}

export interface UserState {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  experimentsRun: number;
  strategiesUsed: MissingValueStrategy[];
  quizHistory: Record<number, boolean>; // questionIndex -> isCorrect
}

export interface SimulationResult {
  originalMean: number;
  cleanedMean: number;
  originalCount: number;
  cleanedCount: number;
  droppedCount: number;
  feedback: {
    change: string;
    reason: string;
    nextStep: string;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedConcept: 'missing' | 'outlier' | 'general';
}
