export type Role = 'AI' | 'HUMAN' | 'CONDITIONAL';
export type ConditionTag = 'DATA' | 'EMOTION' | 'RESPONSIBILITY' | 'CREATIVITY' | 'VERIFICATION' | 'ETHICS';

export interface Mission {
  id: number;
  title: string;
  description: string;
  correctRole: Role;
  correctConditions: ConditionTag[];
  explanation: string; // The "feedback" text
}

export interface CriteriaCard {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: 'AI' | 'HUMAN' | 'BOTH';
}

export interface LearnCase {
  id: string;
  title: string;
  image: string;
  description: string;
  roleAnalysis: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'EASY' | 'HARD';
}

export interface UserState {
  score: number;
  level: number;
  streak: number;
  badges: string[];
  history: {
    missionId: number;
    isCorrect: boolean;
    timestamp: number;
  }[];
  incorrectTags: Record<ConditionTag, number>; // To track weak spots
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (state: UserState) => boolean;
}
