export type TabType = 'concepts' | 'mission' | 'learn' | 'quiz' | 'think';

export interface ConceptCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface MissionOption {
  id: string;
  text: string;
  type: 'correct' | 'risky' | 'ambiguous';
  feedback: string;
}

export interface Mission {
  id: number;
  situation: string;
  tags: string[];
  options: MissionOption[];
  goodReasons: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'privacy' | 'bias' | 'responsibility' | 'dependence';
  difficulty: 'easy' | 'hard';
}

export interface ThinkPrompt {
  type: 'change' | 'counter' | 'design';
  title: string;
  prompt: string;
}

export interface UserState {
  streak: number;
  lastCompletedDate: string | null;
  totalPoints: number;
  badges: string[];
  safetyRules: string[];
  completedMissions: number[]; // IDs of completed missions
  quizHistory: {
    questionId: number;
    isCorrect: boolean;
    date: string;
  }[];
}