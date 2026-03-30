export type ViewState = 'dashboard' | 'theory' | 'puzzle' | 'quiz' | 'thinking';

export interface PuzzleStep {
  id: string;
  text: string;
}

export interface PuzzleScenario {
  id: string;
  title: string;
  category: 'Windows' | 'Printer' | 'Cloud';
  description: string;
  steps: PuzzleStep[]; // The correct order
  scramble?: PuzzleStep[]; // The scrambled order (generated at runtime)
  feedback: {
    [key: string]: string; // key: stepId, value: explanation of why this step is important/ordered here
  };
}

export interface UserStats {
  score: number;
  level: number;
  badges: string[];
  solvedPuzzles: string[]; // IDs of solved puzzles
  wrongAnswers: { puzzleId: string; mistake: string }[];
  lastLoginDate: string; // YYYY-MM-DD
  streakDays: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export enum BadgeType {
  BEGINNER = '네트워크 입문자',
  ARCHITECT = '절차 설계자', // Clear 5 puzzles
  MASTER = '공유 마스터', // Perfect score on quiz
  STREAK = '성실한 연결자' // 3 days streak
}