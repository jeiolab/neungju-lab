export type TransportType = 'WALK' | 'BIKE' | 'BUS' | 'TAXI';

export interface TransportMode {
  id: TransportType;
  name: string;
  speedMultiplier: number; // Higher is faster
  costPerKm: number;
  carbonScore: number; // 10 = clean, 1 = dirty
  safetyScore: number; // 10 = safe, 1 = risky
  icon: string;
}

export interface SimulationState {
  wokeUpLate: boolean;
  transportType: TransportType;
  prepTimeModifier: number; // Minutes reduced from normal prep
  distance: number; // km
}

export interface SimulationResult {
  arrivalTime: string; // HH:MM
  isLate: boolean;
  totalCost: number;
  carbonEmissions: number;
  safetyRating: number;
  timeScore: number; // 0-100
  costScore: number; // 0-100
  envScore: number; // 0-100
  balanceScore: number; // Pareto efficiency metric
  transportType: TransportType;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface UserData {
  badges: Badge[];
  streak: number;
  lastLogin: string;
  mastery: {
    modeling: number;
    tradeoff: number;
  };
  wrongNotes: number[]; // IDs of wrong questions
}