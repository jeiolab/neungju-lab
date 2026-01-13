export interface TrashClass {
  id: string;
  name: string;
  sampleCount: number;
  icon: string; // Emoji or icon name
}

export interface TrainingState {
  isTraining: boolean;
  progress: number;
  accuracy: number;
  version: number;
  isModelReady: boolean;
}

export interface TestResult {
  imageUrl: string;
  actualType: string;
  predictedType: string;
  confidence: number;
  message: string;
  isCorrect: boolean;
}

export interface DebateComment {
  id: string;
  author: string;
  text: string;
  side: 'pro' | 'con';
  timestamp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface AppState {
  cleanedArea: number; // In square meters
  badges: Badge[];
}