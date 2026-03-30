export interface ConceptCard {
  id: string;
  title: string;
  content: string;
  icon: string;
  color: string;
}

export interface QuizQuestion {
  id: number;
  type: 'ordering' | 'multiple_choice' | 'short_answer' | 'essay';
  question: string;
  options?: string[]; // For multiple choice or ordering items
  correctAnswer: string | string[]; // Array for ordering
  explanation: string;
}

export interface UserState {
  score: number;
  level: number;
  streak: number;
  badges: string[];
  puzzleHistory: { date: string; success: boolean }[];
  wrongNotes: number[]; // IDs of wrong questions
}

export enum Tab {
  CONCEPT = 'concept',
  PUZZLE = 'puzzle',
  DEEP_DIVE = 'deep_dive',
  QUIZ = 'quiz',
  THINKING = 'thinking',
  STORY = 'story'
}

export interface PuzzleStep {
  id: string;
  label: string;
  description: string;
}

export interface ThinkingPrompt {
  id: string;
  type: 'condition' | 'counter' | 'design';
  title: string;
  question: string;
}
