export enum Tab {
  CONCEPT = 'CONCEPT',
  BATTLE = 'BATTLE',
  SCENARIO = 'SCENARIO',
  QUIZ = 'QUIZ',
  HALL_OF_FAME = 'HALL_OF_FAME'
}

export enum LearningType {
  SUPERVISED = 'SUPERVISED',
  UNSUPERVISED = 'UNSUPERVISED'
}

export interface CardData {
  id: string;
  text: string;
  type: LearningType;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  highScore: number;
}