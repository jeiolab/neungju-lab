export enum ActionType {
  NONE = 'NONE',
  FAN_ON = 'FAN_ON',
  HEATER_ON = 'HEATER_ON',
  WINDOW_OPEN = 'WINDOW_OPEN',
  ALERT = 'ALERT'
}

export interface SimulationRule {
  id: string;
  conditionVariable: 'temp' | 'humidity';
  operator: '>' | '<' | '>=';
  threshold: number;
  action: ActionType;
}

export interface EnvironmentState {
  temperature: number;
  humidity: number;
  isWindowOpen: boolean;
  isFanOn: boolean;
  isHeaterOn: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  difficulty: 'High' | 'Medium' | 'Low';
  explanation: string;
}

export type TabId = 'theory' | 'simulation' | 'advanced' | 'quiz' | 'thinking';
