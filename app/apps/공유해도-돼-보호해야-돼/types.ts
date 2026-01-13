export enum CardType {
  SHARE = 'SHARE',
  PROTECT = 'PROTECT',
  CONDITIONAL = 'CONDITIONAL',
}

export enum ConditionOption {
  ANONYMIZATION = '가명처리',
  CONSENT = '동의 구하기',
  ACCESS_CONTROL = '접근권한 제한',
  TIME_LIMIT = '기간 제한',
}

export interface GameCard {
  id: string;
  content: string;
  type: CardType;
  requiredConditions?: ConditionOption[]; // Only for CONDITIONAL
  explanation: string; // "Core criterion + Exception"
  category: string; // e.g., "School", "Disaster", "Personal"
}

export interface UserStats {
  level: number;
  xp: number;
  streak: number;
  lastPlayedDate: string | null;
  misconceptions: Record<string, number>; // e.g., {"Public=Share": 3}
  totalGamesPlayed: number;
  totalCorrect: number;
  badges: string[];
}

export enum QuizDifficulty {
  EASY = 'EASY', // Objective
  MEDIUM = 'MEDIUM', // Conditional Logic
  HARD = 'HARD', // Subjective / Counter-example
}

export interface QuizQuestion {
  id: string;
  question: string;
  difficulty: QuizDifficulty;
  options?: string[]; // For Easy
  answer?: string | string[]; // For Easy/Medium
  scenario?: string; // For Medium/Hard
}

export type TabView = 'CONCEPTS' | 'GAME' | 'INFO' | 'QUIZ' | 'ADVANCED';
