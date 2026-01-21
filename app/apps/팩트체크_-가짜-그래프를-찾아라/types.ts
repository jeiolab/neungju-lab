export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  LEARN_MORE = 'LEARN_MORE',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION',
}

export interface Scenario {
  id: number;
  title: string;
  description: string;
  chartType: 'bar' | 'line';
  data: any[];
  distortedProps: {
    yDomain?: [number, number] | ['auto', 'auto'];
    xKey: string;
    dataKey: string;
    label: string;
  };
  correctedProps: {
    yDomain: [number, number];
  };
  hint: string;
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}
