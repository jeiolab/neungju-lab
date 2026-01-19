export enum LearningType {
  SUPERVISED = '지도학습',
  UNSUPERVISED = '비지도학습',
  REINFORCEMENT = '강화학습',
  TRADITIONAL = '전통적 프로그래밍'
}

export enum Difficulty {
  EASY = '쉬움',
  NORMAL = '보통',
  HARD = '도전'
}

export interface Question {
  id: number;
  text: string;
  type: LearningType;
  difficulty: Difficulty;
  explanation: string;
}

export interface UserStats {
  score: number;
  highScore: number;
  streak: number; // Daily streak simulation
  totalGames: number;
  mastery: {
    [key in LearningType]: {
      correct: number;
      attempts: number;
    };
  };
  badges: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}