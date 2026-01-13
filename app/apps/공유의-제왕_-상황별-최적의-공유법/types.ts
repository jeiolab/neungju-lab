export enum ToolType {
  USB = 'USB',
  CLOUD = 'Cloud Link',
  BLUETOOTH = 'Bluetooth/AirDrop',
  EMAIL = 'Email'
}

export interface Scenario {
  id: number;
  description: string;
  fileSize: string;
  distance: 'Nearby' | 'Remote';
  network: 'Available' | 'Unavailable';
  bestTool: ToolType;
  acceptableTools?: ToolType[];
  explanation: string; // The "Team Leader" feedback
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GameStats {
  score: number;
  streak: number;
  mistakes: { [key: string]: number }; // e.g., "Ignored Network": 2
}
