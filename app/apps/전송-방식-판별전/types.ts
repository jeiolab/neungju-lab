export type MethodType = 'Wi-Fi' | 'Bluetooth' | 'NFC' | 'Mobile' | 'Cloud' | 'Wired';

export interface Scenario {
  id: string;
  description: string;
  correctMethod: MethodType;
  reasoning: string; // The "why"
  tags: string[]; // e.g., 'distance', 'security', 'capacity'
}

export interface UserStats {
  score: number;
  streak: number;
  totalPlayed: number;
  correctCount: number;
  badges: string[];
  weaknesses: Record<string, number>; // tag -> failure count
  history: GameHistory[];
}

export interface GameHistory {
  scenarioId: string;
  userChoice: MethodType;
  isCorrect: boolean;
  timestamp: number;
}

export interface TheoryCardData {
  title: string;
  method: MethodType;
  description: string;
  pros: string[];
  cons: string[];
  icon: string;
}

export interface SimState {
  distance: 'close' | 'far';
  fileSize: 'small' | 'large';
  internet: 'yes' | 'no';
  security: 'low' | 'high';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // Index
  explanation: string;
}
