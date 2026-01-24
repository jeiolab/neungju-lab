export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserProfile {
  level: number;
  xp: number;
  badges: string[];
  quizHistory: Record<number, boolean>; // questionId -> isCorrect
  completedSpecs: number;
}

export interface WizardData {
  scenario: string;
  buttonMapping: 'standard' | 'custom'; // We reinforce standard but track choice
  commGroup: string;
  locationMode: 'random' | 'manual';
  testCases: [string, string, string];
}

export interface ProjectSpec {
  id: string;
  data: WizardData;
  timestamp: number;
}

export interface SimulationState {
  status: 'idle' | 'sending' | 'active';
  activeService: 'NONE' | 'AMBULANCE' | 'FIRE' | 'POLICE';
  activeGroup: number | null;
  message: string;
  location: string;
}
