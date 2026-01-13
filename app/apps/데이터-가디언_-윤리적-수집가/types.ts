export type TabId = 'theory' | 'simulation' | 'learn-more' | 'quiz' | 'reflection';

export interface ScenarioOption {
  label: string;
  utilityImpact: number;
  ethicsImpact: number;
  feedback: string;
}

export interface Scenario {
  id: number;
  title: string;
  description: string;
  options: ScenarioOption[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface SimulationState {
  step: number; // 0: Intro, 1...N: Scenarios, N+1: De-id Puzzle, N+2: Result
  utilityScore: number;
  ethicsScore: number;
  history: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (utility: number, ethics: number) => boolean;
}
