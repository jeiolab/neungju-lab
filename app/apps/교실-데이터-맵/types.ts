export type TabType = 'concepts' | 'simulation' | 'realworld' | 'quiz' | 'design';

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  mastery: {
    indexing: number;
    slicing: number;
    dimension: number;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  tag: 'dimension' | 'indexing' | 'slicing' | 'structure';
  explanation: string;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  targetType: 'cell' | 'row' | 'col' | 'slice' | 'edit';
  targetCondition: (r: number, c: number, grid: number[][], selection: any) => boolean;
  hint: string;
}

export interface Feedback {
  action: string;
  reason: string;
  next: string;
}