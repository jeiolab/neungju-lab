export enum NetworkType {
  PAN = 'PAN',
  LAN = 'LAN',
  MAN = 'MAN',
  WAN = 'WAN',
}

export interface GameCard {
  id: number;
  description: string;
  correctType: NetworkType;
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface GameResult {
  date: string;
  score: number; // percentage
  correctCount: number;
  totalCount: number;
  wrongTypes: NetworkType[];
}

export interface WrongNoteItem {
  cardId: number;
  description: string;
  correctType: NetworkType;
  userSelected: NetworkType;
  timestamp: number;
}

export interface DailyActivity {
  activity: string;
  classification?: NetworkType;
  reason?: string;
}
