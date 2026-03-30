export interface GameStats {
  security: number;
  users: number;
  budget: number;
  happiness: number;
}

export interface ChoiceEffect {
  security?: number;
  users?: number;
  budget?: number;
  happiness?: number;
}

export interface Choice {
  id: string;
  text: string;
  effect: ChoiceEffect;
  feedback: string; // The immediate result text after choosing
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
  type: 'dilemma' | 'event';
}

export interface LogEntry {
  week: number;
  message: string;
  type: 'info' | 'danger' | 'success';
}

export interface HistoryPoint {
  week: number;
  value: number; // Calculated company value
  security: number;
  users: number;
}

export enum Tab {
  OFFICE = 'OFFICE',
  SIMULATION = 'SIMULATION',
  CHART = 'CHART',
  AUDIT = 'AUDIT',
  REPORT = 'REPORT',
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AnalysisReport {
  title: string;
  summary: string;
  score: number;
  style: 'Security Paranoid' | 'Balanced Strategist' | 'Reckless Growth Hacker' | 'Bankrupt';
}