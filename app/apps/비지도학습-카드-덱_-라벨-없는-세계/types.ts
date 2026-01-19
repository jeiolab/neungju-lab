export interface ConceptCard {
  id: string;
  title: string;
  definition: string;
  detail: string;
  checkQuestion: {
    q: string;
    options: string[];
    answer: number; // index
  };
}

export interface CaseStudy {
  id: string;
  title: string;
  icon: string;
  description: string;
  attributes: string[]; // Options to choose from
  correctAttributes: string[]; // The ideal attributes to collect
}

export interface QuizQuestion {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  type: 'multiple' | 'short';
  options?: string[];
  answer: string | number; // index for multiple, string for short
  explanation: string;
  relatedConceptId: string;
}

export interface UserStats {
  level: number;
  xp: number; // Total mastery average
  streak: number;
  lastLogin: string;
  cardsReviewedToday: number;
  badges: string[];
  mastery: Record<string, number>; // conceptId -> score (0-100)
  reviewQueue: string[]; // List of concept IDs to review
}

export type TabType = 'theory' | 'simulation' | 'cases' | 'quiz' | 'think' | 'dashboard';