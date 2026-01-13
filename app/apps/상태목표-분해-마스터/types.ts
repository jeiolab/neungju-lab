export interface UserProfile {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string; // YYYY-MM-DD
  badges: string[];
  mastery: Record<string, number>; // conceptId -> percentage
}

export interface TheoryCardData {
  id: string;
  title: string;
  definition: string;
  keywords: string[];
  example: string;
  misconception: {
    wrong: string;
    right: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export interface SubProblem {
  id: string;
  text: string;
  owner: string;
  time: string;
  dependency: string;
}

export interface ProblemModel {
  situation: string;
  constraints: string[];
  goal: string;
  decompositionType: 'function' | 'size';
  subProblems: SubProblem[];
  checklistScores: {
    noOverlap: number;
    includesOriginal: number;
    clearOrder: number;
    atomic: number;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Reflection {
  id: string;
  type: 'condition' | 'counterexample' | 'design';
  prompt: string;
  answer: string;
  date: string;
}
