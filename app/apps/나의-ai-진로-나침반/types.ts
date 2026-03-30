export type TabType = 'concept' | 'simulation' | 'resources' | 'quiz' | 'reflection';

export interface JobResult {
  title: string;
  description: string;
  skills: string[];
  iconName: string;
}

export interface InterestOption {
  id: string;
  label: string;
  iconName: string;
}

export interface TechOption {
  id: string;
  label: string;
  iconName: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
}

export interface ToDoItem {
  id: string;
  text: string;
  completed: boolean;
}