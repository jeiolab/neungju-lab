export enum TabId {
  THEORY = 'theory',
  GAME = 'game',
  JOBS = 'jobs',
  QUIZ = 'quiz',
  REFLECTION = 'reflection',
  ENCYCLOPEDIA = 'encyclopedia'
}

export interface IoTItem {
  id: string;
  name: string;
  isIoT: boolean;
  imageKeyword: string; // Used for picsum seeding or icon mapping
  description: string;
  reason: string; // Why it is or isn't IoT
  tags: string[]; // e.g., ["Internet Connected", "Sensor", "Remote Control"]
}

export interface GameState {
  isPlaying: boolean;
  score: number;
  timeLeft: number;
  combo: number;
  history: string[]; // IDs of unlocked items
}

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};
