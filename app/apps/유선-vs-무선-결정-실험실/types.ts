export interface ExperimentResult {
  id: number;
  timestamp: number;
  users: number;
  walls: number;
  quality: number;
  feedback: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  experimentsCount: number;
  quizScore: number;
  streak: number;
  lastLoginDate: string;
  earnedBadges: string[];
  wrongNoteIds: number[];
}

export interface PosterRule {
  id: string;
  text: string;
  category: 'security' | 'stability' | 'etiquette';
}
