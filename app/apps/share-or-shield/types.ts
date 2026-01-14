export enum ClassificationType {
  SHIELD = 'SHIELD', // Protect
  SHARE = 'SHARE',   // Public/Share
}

export enum GameMode {
  PRACTICE = 'PRACTICE',
  RANKING = 'RANKING', // 60s Time Attack
}

export interface DataCard {
  id: string;
  title: string;
  description: string;
  type: ClassificationType;
  explanation: string; // Why correct?
  difficulty: number; // 1-3
}

export interface GameHistoryItem {
  cardId: string;
  cardTitle: string;
  userChoice: ClassificationType;
  correctType: ClassificationType;
  timestamp: number;
}

export interface RankingRecord {
  score: number;
  date: string;
  comboMax: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}
