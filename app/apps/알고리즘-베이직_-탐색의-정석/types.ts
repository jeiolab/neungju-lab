export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Question {
  id: number;
  question: string;
  options?: string[]; // If undefined, it's a short answer
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface SimulationStep {
  index: number;
  value: number;
  status: 'active' | 'checked' | 'found' | 'eliminated';
  label?: string; // e.g. "Low", "Mid", "High"
}

export interface UserState {
  name: string;
  mastery: number; // 0-100
  badges: string[];
  quizHistory: {
    totalQuestions: number;
    correctCount: number;
    wrongAnswers: number[]; // Question IDs
  };
}