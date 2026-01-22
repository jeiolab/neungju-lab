export enum Tab {
  DASHBOARD = 'DASHBOARD',
  ACTION = 'ACTION',
  LIBRARY = 'LIBRARY',
  QUIZ = 'QUIZ',
  CAMPAIGN = 'CAMPAIGN'
}

export interface FileItem {
  id: string;
  name: string;
  type: 'email' | 'photo' | 'video' | 'doc';
  sizeMB: number;
  isSpam?: boolean;
  date: string;
}

export interface UserStats {
  totalSavedMB: number;
  points: number;
  treeLevel: number;
  co2SavedGrams: number;
  weeklyData: { name: string; savedMB: number }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
