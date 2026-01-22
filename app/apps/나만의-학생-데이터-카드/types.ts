export type DataType = 'int' | 'float' | 'str' | 'bool';

export interface DataItemTemplate {
  id: string;
  label: string;
  defaultType: DataType;
  description: string;
}

export interface WizardItemConfig {
  templateId: string;
  label: string;
  selectedType: DataType;
  varName: string;
  value: string;
  isValid: boolean;
  feedback: string;
}

export interface SavedDesign {
  id: string;
  timestamp: number;
  items: WizardItemConfig[];
  code: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  tags: string[];
}

export interface UserProfile {
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  lastLoginDate: string;
  completedQuizzes: number[];
  designsCreated: number;
}