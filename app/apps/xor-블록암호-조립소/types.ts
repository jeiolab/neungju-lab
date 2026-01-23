export type TabId = 'concept' | 'simulation' | 'learn' | 'quiz' | 'think';

export interface PuzzleStep {
  id: string;
  label: string;
  description: string;
  iconName: string; // Used to map to Lucide icons dynamically
  type: 'prep' | 'process' | 'math' | 'output';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ThinkScenario {
  id: string;
  title: string;
  content: string;
  question: string;
}

export interface AppState {
  currentTab: TabId;
  score: number;
  badges: string[];
  streak: number;
  completedPuzzle: boolean;
  puzzleTime: number; // in seconds
}