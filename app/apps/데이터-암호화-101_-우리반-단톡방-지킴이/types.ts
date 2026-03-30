export type Difficulty = 'easy' | 'normal' | 'hard';

export interface Concept {
  id: string;
  title: string;
  definition: string;
  keywords: string[];
  example: string;
  misconception: {
    myth: string;
    truth: string;
  };
  checkQuestion: {
    question: string;
    options: string[];
    answerIndex: number;
  };
}

export interface QuizQuestion {
  id: string;
  conceptId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string; // Why wrong
  correction: string; // Correction concept
  retryQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  condition: (state: UserState) => boolean;
}

export interface UserState {
  level: number;
  score: number;
  streak: number;
  lastStudyDate: string | null;
  masteryByConcept: Record<string, number>; // 0-100
  badges: string[]; // ids of unlocked badges
  wrongNoteItems: string[]; // ids of questions answered incorrectly
  quizAttempts: Record<string, number>; // questionId -> attempts
  reflectionAnswers: Record<string, string>;
}

export interface SimulationResult {
  riskScore: number;
  feedback: string[];
}
