export type ActionType = 'CLICK' | 'IGNORE' | 'DELETE' | 'REPORT' | 'CHECK_FRIEND' | 'SET_2FA' | 'CHANGE_PW';

export type ScenarioTag = 'URGENCY' | 'CURIOSITY' | 'AUTHORITY' | 'Fear' | 'GREED';

export interface Scenario {
  id: number;
  type: 'SMS' | 'SNS' | 'EMAIL';
  sender: string;
  content: string;
  tags: ScenarioTag[];
  correctActions: ActionType[];
  riskIfClicked: number; // 0-100
  explanation: string;
  imagePlaceholder?: string; // For rendering fake UI
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  explanation: string;
}

export interface UserStats {
  xp: number;
  level: 'TRAINEE' | 'DEFENDER' | 'CAPTAIN';
  streak: number;
  lastPlayed: string; // ISO Date
  vulnerabilities: Record<ScenarioTag, number>; // Higher number = more vulnerable
  badges: string[];
  simulationsCompleted: number;
  quizScore: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  result: 'SUCCESS' | 'FAILURE' | 'NEUTRAL';
  scenarioId?: number;
}

export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  MORE_INFO = 'MORE_INFO',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION'
}