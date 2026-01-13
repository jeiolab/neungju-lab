export enum CardCategory {
  WIRED = '유선',
  WIRELESS = '무선',
  GENERAL = '일반'
}

export enum Difficulty {
  EASY = '쉬움',
  NORMAL = '보통',
  HARD = '도전'
}

export interface ConceptCard {
  id: string;
  term: string;
  definition: string;
  category: CardCategory;
  details: string; // Detailed explanation (back of card)
  icon?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
  difficulty: Difficulty;
}

export interface SimulationScenario {
  id: string;
  situation: string;
  task: string;
  correctChoice: 'wired' | 'wireless';
  feedbackCorrect: string;
  feedbackWrong: string;
}

export interface UserStats {
  xp: number;
  level: number; // 1: 초보, 2: 마스터, 3: 전문가
  streak: number;
  masteredCards: string[]; // IDs of mastered cards
  wrongQuestionIds: string[]; // IDs of questions answered incorrectly
}