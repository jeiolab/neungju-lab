export interface IoTObject {
  id: string;
  name: string;
  type: 'home' | 'city' | 'transport' | 'wearable';
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  iconName: string;
  isUpgraded: boolean;
  normalDescription: string;
  iotDescription: string;
  sensorData: {
    input: string;
    processing: string;
    output: string;
  };
  upgradeMessage: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  isCorrect: boolean; // True for O, False for X
  explanation: string;
}

export type ViewMode = 'simulation' | 'quiz';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
