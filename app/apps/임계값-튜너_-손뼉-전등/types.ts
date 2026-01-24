export interface SimulationStats {
  toggles: number;
  falsePositives: number; // Noise triggering light
  failedNegatives: number; // Clap failing to trigger
  attempts: number;
}

export interface TuningRecord {
  id: string;
  name: string;
  threshold: number;
  debounce: number;
  successRate: number;
  falseTriggers: number;
  timestamp: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface ReflectionEntry {
  situation: string;
  counterExample: string;
  solution: string;
  timestamp: number;
}