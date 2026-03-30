export enum Tab {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  LEARN_MORE = 'learn_more',
  QUIZ = 'quiz',
  THINK = 'think',
  GALLERY = 'gallery'
}

export enum ChartType {
  BAR = 'Bar Chart',
  LINE = 'Line Chart',
  PIE = 'Pie Chart',
  SCATTER = 'Scatter Plot'
}

export interface DataSet {
  name: string;
  data: any[];
  xKey: string;
  yKey: string;
  zKey?: string; // For scatter or extra dimensions
  description: string;
}

export interface Mission {
  id: number;
  title: string;
  goal: string; // e.g., "Compare heights", "Show trend over time"
  bestChart: ChartType;
  dataSet: DataSet;
  hint: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GalleryItem {
  id: string;
  timestamp: number;
  chartType: ChartType;
  missionTitle: string;
  dataSnapshot: any[];
}
