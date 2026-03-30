export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
  difficulty: '초급' | '중급' | '고급';
}

export enum Tab {
  INTRO = 'intro',
  SIMULATOR = 'simulator',
  HISTORY = 'history',
  QUIZ = 'quiz',
  DISCUSSION = 'discussion'
}

export interface ProgressState {
  intro: boolean;
  simulator: boolean;
  history: boolean;
  quiz: boolean;
  discussion: boolean;
}

export interface QuizResult {
  score: number;
  wrongAnswers: number[]; // Array of question IDs
  completed: boolean;
}