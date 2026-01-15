export type SDG = {
  id: number;
  name: string;
  description: string;
  color: string;
};

export type WizardStep = 'intro' | 'sdg' | 'problem' | 'data' | 'model' | 'eval' | 'ethics' | 'review';

export interface ProjectDraft {
  topic: string;
  sdgId: number | null;
  problemCurrent: string;
  problemGoal: string;
  dataFeatures: string;
  dataLabels: string;
  dataCollectionMethod: string;
  isDataSufficient: boolean | null;
  modelType: 'regression' | 'classification' | 'clustering' | null;
  evalMetrics: string;
  ethicsCheck: {
    privacy: boolean;
    bias: boolean;
    transparency: boolean;
  };
  criticalThinking: {
    condition: string;
    counterExample: string;
    application: string;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserStats {
  level: number;
  badges: string[];
  streak: number;
  projectsCompleted: number;
  quizScore: number;
}