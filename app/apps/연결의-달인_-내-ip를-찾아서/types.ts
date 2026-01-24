export enum AppTab {
  CONCEPTS = 'concepts',
  SIMULATION = 'simulation',
  DEEP_DIVE = 'deep_dive',
  QUIZ = 'quiz',
  REFLECTION = 'reflection'
}

export enum Difficulty {
  BEGINNER = 'beginner', // DHCP
  INTERMEDIATE = 'intermediate', // Static IP
  ADVANCED = 'advanced' // Troubleshooting
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-based
  explanation: string;
}

export interface SimulationConfig {
  targetNetwork: string;
  gateway: string;
  subnetMask: string;
  requiredIpStart: string;
}

export interface BadgeState {
  beginner: boolean;
  intermediate: boolean;
  advanced: boolean;
}