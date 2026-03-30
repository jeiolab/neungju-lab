export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'area';

export interface DataPoint {
  name: string;
  value: number;
  value2?: number; // For scatter or multi-line
  [key: string]: string | number | undefined; // Index signature for Recharts compatibility
}

export interface Mission {
  id: string;
  dateStr: string; // YYYYMMDD
  topic: string; // e.g., "환경 이슈", "학교 생활"
  title: string;
  description: string;
  data: DataPoint[];
  availableCharts: ChartType[];
  bestChart: ChartType;
  keywords: string[]; // Keywords required for interpretation score
}

export interface UserEntry {
  date: string;
  missionId: string;
  selectedChart: ChartType;
  title: string;
  interpretation: string;
  score: number;
}

export interface UserProfile {
  streak: number;
  lastCompletedDate: string | null;
  totalCompleted: number;
  badges: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTag: string;
}

export interface WeeklyStat {
  completedCount: number;
  avgScore: number;
  weakConcepts: string[];
}