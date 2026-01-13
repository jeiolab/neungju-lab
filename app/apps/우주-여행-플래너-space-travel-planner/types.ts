export interface Planet {
  id: string;
  name: string;
  nameEn: string;
  distanceFromEarthKm: number; // Average distance
  diameterKm: number;
  color: string;
  description: string;
  revolutionPeriod: string; // e.g., "88 days"
}

export interface TravelRecord {
  planetId: string;
  timestamp: number;
  travelTimeHours: number;
  speedUsed: number;
}

export enum AppTab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  DEEP_DIVE = 'DEEP_DIVE',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION',
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}