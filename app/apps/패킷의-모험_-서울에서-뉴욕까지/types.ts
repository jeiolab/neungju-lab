export interface PacketStep {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

export type UserLevel = 'Local' | 'National' | 'Global';

export interface UserStats {
  score: number;
  level: UserLevel;
  correctQuizCount: number;
  simulationCompleted: boolean;
}

export type TabType = 'theory' | 'simulation' | 'learn-more' | 'quiz' | 'think';