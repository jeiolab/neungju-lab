export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface GameState {
  isPlaying: boolean;
  isLoading: boolean;
  progress: number; // 0 to 100 for visual gauge
}

export enum Sender {
  USER = 'user',
  MODEL = 'model'
}

