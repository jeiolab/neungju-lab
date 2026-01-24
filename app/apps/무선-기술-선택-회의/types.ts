export type TechType = 'WiFi' | 'Bluetooth' | 'NFC' | 'RFID' | 'Cellular';

export interface TechProfile {
  id: TechType;
  name: string;
  description: string;
  distance: number; // 0-100 scale
  speed: number;    // 0-100 scale
  security: number; // 0-100 scale
  cost: number;     // 0-100 scale (Lower is cheaper/better or Higher is expensive? Let's use Higher = More Expensive)
  convenience: number; // 0-100
  typicalUses: string[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  requiredTech: TechType;
  idealAttributes: {
    security: number; // Importance 0-100
    distance: number; // Importance 0-100
  };
  contextHint: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserState {
  points: number;
  level: number;
  streak: number;
  badges: string[];
  decisions: Record<string, { tech: TechType; score: number; timestamp: number }>;
  completedQuizzes: number[];
  mastery: Record<TechType, number>;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  condition: string;
}

export interface CareerCard {
  title: string;
  description: string;
  skills: string[];
}
