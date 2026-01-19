export type TabType = 'theory' | 'sim' | 'explore' | 'quiz' | 'think';

export interface ConceptCard {
  id: string;
  title: string;
  definition: string;
  keywords: string[];
  example: string;
  misconception: string;
  correction: string;
  checkQuestion: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
}

export interface QuizQuestion {
  id: string;
  difficulty: 'easy' | 'normal' | 'hard';
  relatedConceptId: string; // To link back to concepts
  question: string;
  type: 'multiple' | 'short';
  options?: string[]; // For multiple choice
  correctAnswer: string; // String for check
  explanation: string;
  misconceptionType?: string; // e.g., "Label/Feature Confusion"
}

export interface ThinkProblem {
  id: string;
  type: 'condition' | 'counterexample' | 'design';
  title: string;
  description: string;
}

export interface UserState {
  mastery: Record<string, number>; // conceptId -> score (0-100)
  cardStatus: Record<string, 'understood' | 'confused' | null>; // conceptId -> status
  checkQuestionHistory: Record<string, boolean>; // conceptId -> passed?
  quizHistory: {
    questionId: string;
    isCorrect: boolean;
    date: string;
  }[];
  streak: number;
  lastLoginDate: string;
  badges: string[];
  thinkAnswers: Record<string, string>; // problemId -> answer
}

export interface SimulationState {
  mode: 'traditional' | 'ml';
  dataVolume: number; // 1-100
}
