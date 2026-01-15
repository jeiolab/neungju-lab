export interface Concept {
  id: string;
  title: string;
  definition: string; // 한 줄 정의
  keywords: string[]; // 3개
  example: string; // 학교/친구 맥락
  misconception: {
    myth: string;
    fact: string;
  };
  checkQuestion: {
    question: string;
    answer: string;
  };
}

export interface QuizQuestion {
  id: string;
  type: 'multiple' | 'short' | 'narrative';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[]; // For multiple choice
  answerKey: string | string[]; // Correct answer or keywords
  feedback: {
    reason: string; // 왜 틀렸는지
    correction: string; // 교정 내용
  };
}

export interface SimulationResult {
  qualityScore: number; // 0-100
  riskScore: number; // 0-100
  feedback: {
    observation: string;
    reason: string;
    suggestion: string;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (user: UserState) => boolean;
}

export interface UserState {
  xp: number;
  level: number;
  badges: string[]; // badge IDs
  streak: number;
  lastLoginDate: string;
  mastery: Record<string, number>; // conceptId -> 0-100
  wrongNotes: Array<{
    questionId: string;
    timestamp: number;
    wrongAnswer: string;
  }>;
  essayAnswers: Record<string, string>; // promptId -> text
}

export type TabType = 'concept' | 'simulation' | 'more' | 'quiz' | 'think';