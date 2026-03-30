export type DataType = 'int' | 'float' | 'str' | 'bool';

export interface DataItem {
  id: string;
  content: string | number | boolean;
  type: DataType;
  display: string; // How it looks on screen (e.g., adding quotes for strings)
}

export interface GameState {
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  combo: number;
  gameOver: boolean;
  highScore: number;
  mistakes: string[]; // List of items sorted incorrectly
}

export interface QuizQuestion {
  id: number;
  question: string;
  answer: boolean; // O = true, X = false
  explanation: string;
}

export interface TabConfig {
  id: 'theory' | 'game' | 'advanced' | 'quiz' | 'think';
  label: string;
  icon: string;
}
