export type JobType = 'AUTOMATION' | 'COLLABORATION' | 'HUMAN_CENTRIC';

export interface JobCard {
  id: string;
  title: string;
  category: string;
  tags: {
    repetitive: boolean; // 반복성
    ruleBased: boolean; // 규칙 기반
    humanCare: boolean; // 대면/감정
    creative: boolean; // 창의/판단
    safetyRisk: boolean; // 안전 위험
  };
  correctType: JobType;
  description: string;
  feedback: {
    reason: string; // 태그 기반 근거
    techRole: string; // 기술 역할 vs 사람 역할
    analogy: string; // 학교/알바 비유
  };
}

export interface ConceptCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
  keyPoint: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  conceptTag: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  badges: string[];
  gameHistory: {
    jobId: string;
    isCorrect: boolean;
  }[];
  quizHistory: {
    questionId: number;
    isCorrect: boolean;
  }[];
  conceptMastery: Record<string, number>; // conceptId -> 0-100
}

export interface SimulationState {
  repetitive: number;
  ruleBased: number;
  humanCare: number;
  creative: number;
}