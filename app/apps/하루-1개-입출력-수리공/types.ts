export type TabType = 'concepts' | 'mission' | 'scenario' | 'quiz' | 'thinking';

export interface Concept {
  id: string;
  title: string;
  content: string;
  codeSnippet: string;
  category: 'Standard' | 'File';
}

export interface MissionOption {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
}

export interface DailyMission {
  id: string;
  type: 'mode_fix' | 'close_fix' | 'input_fix';
  title: string;
  description: string;
  brokenCode: string;
  options: MissionOption[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tags: string[];
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastLoginDate: string;
  completedMissions: Record<string, boolean>; // date string -> completed
  badges: string[];
  quizHistory: {
    totalAttempts: number;
    wrongQuestionIds: number[];
  };
  thinkingAnswers: Record<number, string>;
}

export const INITIAL_PROGRESS: UserProgress = {
  xp: 0,
  streak: 0,
  lastLoginDate: '',
  completedMissions: {},
  badges: [],
  quizHistory: { totalAttempts: 0, wrongQuestionIds: [] },
  thinkingAnswers: {},
};
