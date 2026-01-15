export enum Tab {
  CASE_REQUEST = 'CASE_REQUEST',
  FIELD_INVESTIGATION = 'FIELD_INVESTIGATION',
  INVESTIGATION_LOG = 'INVESTIGATION_LOG',
  DEDUCTION_ESSAY = 'DEDUCTION_ESSAY',
  CASE_CLOSED = 'CASE_CLOSED',
}

export enum DatasetType {
  PENGUINS = 'PENGUINS',
  SCHOOLS = 'SCHOOLS',
}

export interface DataPoint {
  id: number;
  x: number; // e.g., Flipper Length or Student Count
  y: number; // e.g., Bill Length or Teacher Count
  category: string; // The "Ground Truth" label
  color: string;
}

export interface GameState {
  score: number;
  completedMissions: string[];
  detectiveRank: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
