export interface JobResult {
  id: string;
  jobTitle: string;
  description: string;
  humanSkills: string[];
  digitalSkills: string[];
  coexistenceNote: string;
  tags: {
    interest: string;
    tech: string;
    style: string;
  };
  createdAt: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  answer: boolean; // true for O, false for X
  explanation: string;
}

export interface DictionaryItem {
  title: string;
  category: string;
  description: string;
  skills: string[];
}

export type TabType = 'evolution' | 'mixer' | 'dictionary' | 'quiz' | 'card';

export interface SelectionOption {
  id: string;
  label: string;
  icon?: string;
}