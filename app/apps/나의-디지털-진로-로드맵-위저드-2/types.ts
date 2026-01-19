export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  EXPLORE = 'EXPLORE',
  QUIZ = 'QUIZ',
  THINK = 'THINK',
  WIZARD = 'WIZARD'
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  streak: number;
  lastLogin: string;
  badges: string[];
}

export interface WizardData {
  interest: string;
  activity: string;
  resources: string;
  keyword: string;
}

export interface ProjectPlan {
  problemDefinition: string;
  background: string;
  dataUsage: string;
  solutionSteps: string[];
  expectedEffects: {
    positive: string[];
    negative: string;
    response: string;
  };
  pitchScript: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: '기술' | '윤리' | '현실성';
}

export interface CareerCard {
  id: number;
  title: string;
  techStack: string[];
  description: string;
  schoolActivity: string;
}

export interface SimulationState {
  dataQuality: boolean;
  ethicsCheck: boolean;
  feasibility: boolean;
  teamRole: boolean;
  feedback: string;
  score: number;
}
