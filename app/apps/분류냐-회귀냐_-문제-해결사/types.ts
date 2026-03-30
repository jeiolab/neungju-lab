export enum TabType {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  DEEP_DIVE = 'DEEP_DIVE',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION',
}

export enum AlgorithmType {
  CLASSIFICATION = 'CLASSIFICATION',
  REGRESSION = 'REGRESSION',
}

export interface Scenario {
  id: string;
  question: string;
  type: AlgorithmType;
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  dataPreview: string; // Describes the table/data format
  question: string;
  answer: AlgorithmType;
  explanation: string;
}

export interface MasteryStats {
  classificationCorrect: number;
  classificationTotal: number;
  regressionCorrect: number;
  regressionTotal: number;
}
