export type AgentStep = 'Perception' | 'Learning' | 'Reasoning' | 'Action';

export interface AgentStepData {
  id: AgentStep;
  koreanName: string;
  description: string;
  icon: string;
  color: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tags: string[]; // e.g., '인식', '추론'
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastLogin: string;
  badges: string[];
  solvedPuzzleCount: number;
  wrongConcepts: Record<string, number>; // Tag -> Count
  myAgentCards: MyAgentCard[];
}

export interface MyAgentCard {
  id: string;
  name: string;
  steps: {
    Perception: string;
    Learning: string;
    Reasoning: string;
    Action: string;
  };
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  correctOrder: AgentStep[];
}

export interface ErrorCase {
  id: string;
  missingStep: AgentStep;
  title: string;
  scenario: string;
  consequence: string;
}
