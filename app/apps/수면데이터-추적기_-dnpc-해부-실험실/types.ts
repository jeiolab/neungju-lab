export type TabType = 'concepts' | 'simulation' | 'explore' | 'quiz' | 'think';

export interface ExperimentLog {
  id: number;
  timestamp: string;
  samplingInterval: number;
  transmissionDelay: number;
  reliability: number;
  note: string;
}

export interface QuizQuestion {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserState {
  xp: number;
  streak: number;
  lastVisit: string; // ISO date string
  completedExperiments: number;
  badges: string[];
  weakConcept: string | null;
  quizHistory: { [key: number]: boolean }; // questionId: correct
  experimentLogs: ExperimentLog[];
  thinkNotes: { condition: string; counter: string; design: string };
}

export const INITIAL_USER_STATE: UserState = {
  xp: 0,
  streak: 0,
  lastVisit: new Date().toISOString(),
  completedExperiments: 0,
  badges: [],
  weakConcept: null,
  quizHistory: {},
  experimentLogs: [],
  thinkNotes: {
    condition: '',
    counter: '',
    design: '',
  },
};