export interface AgentDesign {
  name: string;
  perception: {
    sensors: string[];
    dataTypes: string[];
    location: string;
  };
  analysis: {
    threshold: string;
    logic: string; // e.g., "If pH < 6"
  };
  reasoning: {
    decision: string; // e.g., "Trigger alarm"
    strategy: string; // e.g., "Conservative"
  };
  action: {
    actuators: string[];
    feedback: string;
  };
  characteristics: string[]; // Autonomy, Reactivity, etc.
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TheoryCard {
  id: string;
  title: string;
  icon: string;
  definition: string;
  keywords: string[];
  example: string;
  misconception: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  THEORY = 'THEORY',
  WIZARD = 'WIZARD',
  SIMULATION = 'SIMULATION',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION'
}