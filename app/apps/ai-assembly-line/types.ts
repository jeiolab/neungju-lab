export enum MLStepType {
  PROBLEM_DEFINITION = 'PROBLEM_DEFINITION',
  DATA_COLLECTION = 'DATA_COLLECTION',
  PREPROCESSING = 'PREPROCESSING',
  MODEL_TRAINING = 'MODEL_TRAINING',
  EVALUATION = 'EVALUATION',
}

export enum AlgorithmType {
  REGRESSION = 'REGRESSION', // 회귀 (수치 예측)
  CLASSIFICATION = 'CLASSIFICATION', // 분류 (범주 예측)
}

export interface MLStep {
  id: string;
  type: MLStepType;
  label: string;
  description: string;
  iconName: string; // Using string to map to Lucide icons dynamically or statically
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  goal: string;
  correctAlgorithm: AlgorithmType;
  dataVariables: string[];
}

export interface QuizQuestion {
  id: string;
  scenario: string;
  brokenSequence: MLStepType[];
  correctMissingStep: MLStepType;
  explanation: string;
}

export type AssemblyStatus = 'IDLE' | 'RUNNING' | 'SUCCESS' | 'ERROR';