export enum Classification {
  HUMAN = 'HUMAN',
  AI = 'AI',
  COLLAB = 'COLLAB'
}

export interface TaskCard {
  id: string;
  title: string;
  category: Classification;
  icon: string;
  description: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  relatedConcept: string; // Used for "Weak Concept" analysis
}

export interface TheoryCard {
  title: string;
  humanSide: string;
  aiSide: string;
  icon: any;
}

export interface UserStats {
  gameHighScore: number;
  quizScore: number;
  totalQuizAttempts: number;
  weakConcepts: string[];
}