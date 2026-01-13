export enum Tab {
  OPERATION = 'OPERATION',
  PRINCIPLES = 'PRINCIPLES',
  ARCHIVES = 'ARCHIVES',
  EXAM = 'EXAM',
  THINK_TANK = 'THINK_TANK',
}

export enum AlgorithmType {
  RLE = 'RLE',
  LZ = 'LZ',
}

export interface CompressionResult {
  original: string;
  compressed: string;
  ratio: number;
  steps: string[];
  isEfficient: boolean;
}

export enum AgentLevel {
  TRAINEE = '수습 요원',
  JUNIOR = '일반 요원',
  SENIOR = '정예 요원',
  MASTER = '마스터 스파이',
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedConcept: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  wrongAnswers: number[]; // IDs of wrong answers
  isFinished: boolean;
}