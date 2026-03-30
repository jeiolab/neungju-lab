export enum Tab {
  THEORY = 'THEORY',
  WIZARD = 'WIZARD',
  EXAMPLES = 'EXAMPLES',
  QUIZ = 'QUIZ',
  SECURITY = 'SECURITY'
}

export interface IoTProject {
  id: string;
  timestamp: number;
  location: string;
  problem: string;
  sensor: string;
  actuator: string;
  logic: string; // If-Then statement
  rating?: number;
  aiFeedback?: string;
}

export interface SensorInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ActuatorInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // Index of correct answer
  explanation: string;
}