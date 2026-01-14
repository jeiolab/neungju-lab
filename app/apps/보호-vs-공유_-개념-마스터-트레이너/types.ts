export type Difficulty = '쉬움' | '보통' | '도전';
export type QuizType = 'multiple-choice' | 'short-answer' | 'descriptive';
export type MasteryStatus = 'unknown' | 'known' | 'confused';

export interface Concept {
  id: string;
  title: string;
  definition: string;
  keywords: string[];
  example: string;
  misconception: {
    myth: string;
    correction: string;
  };
  checkQuestion: {
    question: string;
    answer: boolean; // True for O, False for X
    explanation: string;
  };
}

export interface QuizQuestion {
  id: string;
  type: QuizType;
  difficulty: Difficulty;
  question: string;
  options?: string[]; // Only for multiple-choice
  answerKeywords: string[]; // For short/descriptive checking
  correctAnswerIndex?: number; // For multiple-choice
  explanation: string;
  retryQuestion?: QuizQuestion; // Nested question for retry mechanic
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string; // ISO Date string
  badges: string[];
}

export interface MasteryState {
  [conceptId: string]: MasteryStatus; // 'known' | 'confused'
}

export interface WrongNote {
  id: string; // Unique ID for the note
  qid: string;
  conceptTitle: string;
  question: string;
  userAnswer: string;
  misconceptionType: string;
  difficulty: Difficulty;
  timestamp: number;
}

export interface ReflectionEntry {
  id: string;
  type: 'condition' | 'counter-example' | 'application';
  content: string;
  date: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (progress: UserProgress, mastery: MasteryState, wrongNotes: WrongNote[]) => boolean;
}