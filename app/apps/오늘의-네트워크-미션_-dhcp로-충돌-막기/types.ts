export type TabId = 'mission' | 'concepts' | 'simulation' | 'more' | 'quiz';

export interface Concept {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  relatedConcept: string;
}

export interface DailyStats {
  date: string; // YYYYMMDD
  completed: boolean;
  quizScore: number;
  reflection: string;
}

export interface AppState {
  currentTab: TabId;
  streak: number;
  mastery: number; // 0-100
  wrongNotes: number[]; // IDs of wrong questions
  dailyDone: Record<string, boolean>; // date -> done
  lastVisit: string;
}

export interface SimulationState {
  dhcpEnabled: boolean;
  deviceCount: number;
}
