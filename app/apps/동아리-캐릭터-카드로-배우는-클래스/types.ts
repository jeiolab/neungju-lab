export type Tab = 'theory' | 'simulation' | 'deepdive' | 'quiz' | 'discussion';

export interface TheoryCard {
  id: number;
  title: string;
  definition: string; // 한 줄 정의
  keywords: string[]; // 키워드 3개
  example: string; // 예시
  misconception: {
    statement: string; // 흔한 오해
    correction: string; // 교정
  };
  checkQuestion: {
    question: string;
    options: string[];
    answer: number; // index
  };
}

export interface QuizQuestion {
  id: number;
  type: 'multiple' | 'short' | 'descriptive';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | number; // For short answer or index
  explanation: string;
}

export interface UserProgress {
  level: number;
  xp: number; // 0 to 100 per concept
  badges: string[];
  streak: number;
  lastLogin: string;
  quizScore: number;
  solvedQuestions: number[]; // IDs of solved questions
}

export interface CharacterInstance {
  id: number;
  name: string;
  role: string;
  level: number;
  hp: number;
}
