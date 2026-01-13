export type ScenarioType = 'lunch' | 'icecream' | 'co2';

export interface DataPoint {
  x: number;
  y: number;
  type: 'train' | 'test';
}

export interface SimulationState {
  scenario: ScenarioType;
  dataCount: number;
  noiseLevel: number;
  featureValue: number; // Represents the independent variable's underlying strength
  modelType: 'linear' | 'polynomial';
  splitRatio: number;
}

export interface ExperimentLog {
  id: number;
  timestamp: string;
  scenario: string;
  mae: number;
  note: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface UserStats {
  points: number;
  streak: number;
  lastVisit: string;
  badges: string[];
  quizScore: number;
  masteryTags: string[];
}