export interface CodeBlock {
  id: string;
  text: string;
  order: number; // Correct order index
}

export interface DailyMission {
  date: string;
  title: string;
  description: string;
  datasetType: 'sorted' | 'unsorted' | 'hashed';
  targetItem: string;
  dataset: string[]; // Simulation data
  optimalAlgorithm: 'linear' | 'binary';
  codeBlocks: CodeBlock[];
  quizQuestion: string;
  quizAnswer: string;
  theoryContent: string;
}

export type TabType = 'theory' | 'simulation' | 'quiz' | 'extra' | 'think';

export interface UserState {
  streak: number;
  lastPlayedDate: string | null;
  completedToday: boolean;
  score: number;
}
