export interface Snack {
  id: string;
  name: string;
  servingSize: number; // g
  kcal: number;
  isUserAdded?: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface Centroid extends Point {
  clusterId: number;
}

export interface ClusteredSnack extends Snack {
  clusterId: number;
}

export interface KMeansResult {
  clusters: ClusteredSnack[];
  centroids: Centroid[];
  iterations: number;
}

export type DistanceType = 'euclidean' | 'manhattan';

export interface ConceptCardData {
  id: string;
  title: string;
  definition: string;
  keywords: string[];
  example: string;
  misconception: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

export interface QuizQuestion {
  id: string;
  difficulty: 'easy' | 'normal' | 'hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProgress {
  score: number;
  badges: string[];
  streak: number;
  lastVisitDate: string;
  mastery: {
    concepts: number; // 0-100
    simulation: number;
    quiz: number;
  };
  completedConcepts: string[]; // ids
  solvedQuizzes: string[]; // ids
  incorrectQuizzes: string[]; // ids (for review)
  dailyMissionCompleted: boolean;
  reflections: {
    condition: string;
    counterExample: string;
    application: string;
    deepDive: string;
  };
}