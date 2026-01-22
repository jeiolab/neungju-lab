export enum ToolType {
  NONE = 'NONE',
  CAESAR_WHEEL = 'CAESAR_WHEEL',
  SCYTALE_GRID = 'SCYTALE_GRID',
  HASH_ANALYZER = 'HASH_ANALYZER'
}

export enum LevelStatus {
  LOCKED = 'LOCKED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  cipherText: string;
  hint: string;
  solution: string; // The correct answer (normalized)
  toolAllowed: ToolType;
  storyContext: string;
}

export interface GameState {
  currentLevelIndex: number;
  score: number;
  timeRemaining: number; // in seconds
  isGameOver: boolean;
  gameWon: boolean;
  history: string[]; // Log of messages
}