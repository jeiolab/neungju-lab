export type TabType = 'theory' | 'simulation' | 'learn' | 'quiz' | 'thought';

export interface GameState {
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  lastPlayedDate: string | null;
  masteryByConcept: Record<string, number>; // 0-100
  wrongNotes: WrongNote[];
  dailyMissionCompleted: boolean;
}

export interface WrongNote {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  timestamp: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: (state: GameState, sessionStats: SessionStats) => boolean;
}

export interface SessionStats {
  binaryWinsStreak: number;
  multiCorrectCount: number;
  totalAttempts: number;
}

// Simulation Types
export type ClassificationType = 'binary' | 'multiclass';

export interface MailFeature {
  hasKeywords: boolean; // 무료, 쿠폰 등
  upperCaseRatio: number; // 0.0 - 1.0
  linkCount: number;
  domainRisk: number; // 0 - 100
  isSpam: boolean; // True Label
}

export type ClubType = 'IT' | 'Arts' | 'Sports' | 'Volunteer';

export interface StudentFeature {
  interest: 'Tech' | 'Creative' | 'Active' | 'Social';
  hoursAvailable: number;
  withFriends: boolean;
  prefersCompetition: boolean;
  recommendedClub: ClubType; // True Label
}

export interface DataPoint {
  id: number;
  features: number[]; // Normalized for k-NN
  label: string;
}
