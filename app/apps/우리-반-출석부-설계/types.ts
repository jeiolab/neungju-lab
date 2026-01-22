export interface StudentAttribute {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean';
  defaultValue: any;
  label: string;
}

export interface StudentMethod {
  id: string;
  name: string;
  description: string;
  action: (student: StudentInstance) => StudentInstance;
  label: string;
}

export interface StudentInstance {
  id: number;
  values: Record<string, any>; // maps attribute id to value
}

export interface WizardData {
  className: string;
  selectedAttributes: StudentAttribute[];
  selectedMethods: StudentMethod[];
  instances: StudentInstance[];
}

export interface QuizQuestion {
  id: number;
  type: 'multiple' | 'short';
  question: string;
  options?: string[];
  answer: string; // for checking
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserProgress {
  points: number;
  badges: string[];
  streak: number;
  lastLogin: string; // ISO date string
  completedWizard: boolean;
  quizScore: number;
  thinkingCompleted: number;
}
