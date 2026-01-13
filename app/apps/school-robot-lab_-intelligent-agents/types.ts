export enum Tab {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  DEEP_DIVE = 'deep_dive',
  QUIZ = 'quiz',
  REFLECTION = 'reflection',
}

export enum SensorQuality {
  LOW = 'LOW',
  HIGH = 'HIGH',
}

export enum PolicyType {
  RULE_BASED = 'RULE_BASED',
  LEARNING_REASONING = 'LEARNING_REASONING',
}

export interface SimulationResult {
  id: string;
  timestamp: number;
  sensorQuality: SensorQuality;
  policyType: PolicyType;
  successRate: number;
  feedback: {
    perception: string;
    reasoning: string;
    action: string;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface ReflectionEntry {
  scenario: string;
  sensor: string;
  decision: string;
  action: string;
  feedback?: string;
}

export interface AppState {
  badges: Badge[];
  streak: number;
  lastLogin: string; // ISO Date string
  simulationRuns: SimulationResult[];
  quizScore: number;
  totalXp: number;
}