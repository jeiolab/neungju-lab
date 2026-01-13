export interface FarmState {
  temperature: number; // Celsius
  humidity: number; // %
  feedAmount: number; // kg/day
  sensorSensitivity: number; // 0-100
  pigHealth: number; // 0-100 score
  productivity: number; // 0-100 score
  day: number;
}

export interface SimulationLog {
  day: number;
  health: number;
  productivity: number;
}

export enum ScenarioType {
  NONE = 'NONE',
  HEATWAVE = 'HEATWAVE',
  DISEASE = 'DISEASE',
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
