export type TabType = 'theory' | 'simulation' | 'learn-more' | 'quiz' | 'discussion';

export interface UserState {
  points: number;
  level: string; // '초보 조련사' | '베테랑 엔지니어'
  streak: number;
  lastLoginDate: string;
  completedSimulations: number;
  quizMistakes: number[]; // IDs of wrong questions
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
  difficulty: '하' | '중' | '상';
}

export interface SimItem {
  id: string;
  type: 'apple' | 'banana';
  feature: string; // Visual description e.g. "Red & Round"
  icon: string;
}

export enum UserLevel {
  NOVICE = '초보 조련사',
  INTERMEDIATE = '숙련된 조교',
  EXPERT = '베테랑 엔지니어',
  MASTER = 'AI 마스터'
}