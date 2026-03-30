export type TaskType = 'Regression' | 'Classification' | 'Clustering';
export type ModelType = 'LinearRegression' | 'LogisticRegression' | 'KMeans' | 'DecisionTree' | 'RandomForest';
export type DataCondition = 'Sufficient' | 'Insufficient' | 'Noisy';

export interface Scenario {
  id: string;
  title: string;
  category: 'School' | 'Life' | 'Career';
  description: string;
  correctTask: TaskType;
  difficulty: 1 | 2 | 3;
}

export interface SimulationResult {
  score: number;
  balanceScore: number;
  explanationScore: number; // Placeholder for future feature
  feedback: {
    strength: string;
    weakness: string;
    recommendation: string;
  };
  metrics: {
    accuracy: number;
    explainability: number;
    cost: number;
  };
}

export interface UserStats {
  totalScore: number;
  quizzesSolved: number;
  badges: string[];
  history: Array<{
    scenarioId: string;
    score: number;
    timestamp: number;
  }>;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
  type: 'MultipleChoice' | 'TrueFalse';
}

export enum Page {
  Home,
  Simulation,
  Theory,
  Quiz,
  Profile
}