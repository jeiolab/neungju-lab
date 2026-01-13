export type FileMode = 'w' | 'a' | 'r';

export interface LogEntry {
  id: string;
  date: string;
  content: string;
}

export type TabType = 'concept' | 'simulation' | 'advanced' | 'quiz' | 'addons';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
