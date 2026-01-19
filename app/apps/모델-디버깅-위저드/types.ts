export enum ProblemType {
  CLASSIFICATION = '분류 (Classification)',
  REGRESSION = '회귀 (Regression)',
}

export enum DataSize {
  SMALL = '작음 (50개)',
  MEDIUM = '보통 (200개)',
  LARGE = '많음 (1000개)',
}

export enum NoiseLevel {
  LOW = '낮음 (깨끗함)',
  MEDIUM = '보통 (약간의 오류)',
  HIGH = '높음 (지저분함)',
}

export interface SimulationState {
  problemType: ProblemType;
  dataSize: DataSize;
  noiseLevel: NoiseLevel;
  splitRatio: number; // e.g., 0.7 for 70/30
  modelComplexity: number; // 1 to 10 (Tree Depth)
}

export interface SimulationResult {
  trainScore: number;
  testScore: number;
  message: string;
  status: 'underfitting' | 'good' | 'overfitting' | 'severe_overfitting';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}