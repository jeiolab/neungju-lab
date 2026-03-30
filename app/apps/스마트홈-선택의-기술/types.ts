export interface IoTFeature {
  id: string;
  name: string;
  description: string;
  // Added 'safety' to allowed categories
  category: 'security' | 'convenience' | 'health' | 'energy' | 'safety';
  scores: {
    convenience: number;
    safety: number;
    privacyRisk: number;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  biasType: 'risk_underestimation' | 'risk_overestimation' | 'balanced' | 'knowledge_gap';
}

export interface CaseStudy {
  id: string;
  title: string;
  image: string;
  description: string;
  pros: string[];
  cons: string[];
  correctProIndex: number;
  correctConIndex: number;
}

export type TabType = 'concepts' | 'simulation' | 'cases' | 'quiz' | 'thinking';

export interface ThinkingProblem {
  id: string;
  type: 'condition' | 'counter_example' | 'design';
  title: string;
  prompt: string;
  placeholder: string;
}

export interface UserState {
  privacySensitivity: number; // 0-100
  selectedFeatures: string[];
  completedCases: string[];
  quizScore: number;
  quizAnswers: Record<number, number>; // questionId -> optionIndex
  badges: string[];
  streak: number;
  thinkingAnswers: Record<string, string>;
  thinkingFeedback: Record<string, string>;
}