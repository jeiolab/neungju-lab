export type MLType = 'supervised' | 'unsupervised' | 'reinforcement';

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  recommendedType: MLType; // The ideal answer
  acceptableTypes?: MLType[]; // Other answers that might get partial credit
  hint: string;
}

export interface UserStats {
  level: '인턴' | '연구원' | '소장';
  points: number;
  projectsCompleted: number;
}

export interface PortfolioItem {
  id: string;
  timestamp: number;
  problemTitle: string;
  selectedType: MLType;
  features: string;
  score: number; // 0 to 100
  feedback: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export const ML_TYPE_LABELS: Record<MLType, string> = {
  supervised: '지도학습 (정답 O)',
  unsupervised: '비지도학습 (정답 X)',
  reinforcement: '강화학습 (보상)'
};