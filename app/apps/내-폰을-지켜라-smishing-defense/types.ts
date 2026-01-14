export type MessageType = 'SMS' | 'DM' | 'EMAIL' | 'KAKAO';

export interface Scenario {
  id: string;
  sender: string;
  content: string;
  type: MessageType;
  isSmishing: boolean;
  explanation: string; // Why it is smishing or why it is safe
  clues: string[]; // Specific things to look for
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface ThreatRecord {
  scenario: Scenario;
  outcome: 'DEFENDED' | 'INFECTED' | 'MISSED';
  timestamp: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export enum GameState {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  FEEDBACK = 'FEEDBACK',
  GAME_OVER = 'GAME_OVER',
}

export interface SecurityTip {
  title: string;
  content: string;
  icon: string;
}