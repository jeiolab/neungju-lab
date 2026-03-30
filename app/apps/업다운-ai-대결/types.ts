export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  LEARN_MORE = 'LEARN_MORE',
  QUIZ = 'QUIZ',
  THINK = 'THINK'
}

export enum GameMode {
  USER_HOST = 'USER_HOST', // Mode A: User thinks, AI guesses
  AI_HOST = 'AI_HOST'      // Mode B: AI thinks, User guesses
}

export interface GameConfig {
  min: number;
  max: number;
}

export interface GuessHistory {
  value: number;
  result: 'UP' | 'DOWN' | 'CORRECT';
  turn: number;
}

export interface LeaderboardEntry {
  date: string;
  attempts: number;
  range: number;
  mode: GameMode;
}