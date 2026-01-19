export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SimState {
  twoFactor: boolean; // 2단계 인증 (True=ON, False=OFF)
  publicPcLogout: boolean; // 공용PC 로그아웃 (True=Logout, False=Stay)
  clickSuspiciousLink: boolean; // 수상한 링크 (True=Click, False=Ignore)
  cloudAutoLogin: boolean; // 클라우드 자동로그인 (True=Keep, False=Off)
}

export interface SimResult {
  score: number; // 0 (Safe) to 100+ (Danger)
  level: RiskLevel;
  scenario: string;
  feedback: string[];
}

export interface TheoryCard {
  id: string;
  title: string;
  category: 'Hacking' | 'Smishing' | 'Auth';
  content: string;
  checkQuestion: string; // 10초 체크 질문
  checkAnswer: boolean; // True/False 답
}

export type QuizDifficulty = 'EASY' | 'NORMAL' | 'CHALLENGE';

export interface QuizQuestion {
  id: string;
  difficulty: QuizDifficulty;
  question: string;
  options?: string[]; // For objective
  correctAnswer?: string; // For objective/short answer
  explanation?: string; // Feedback
}

export interface UserProgress {
  streak: number;
  lastLoginDate: string;
  defenseScore: number;
  badges: string[];
  solvedQuizzes: string[]; // IDs
  vulnerableConcepts: string[]; // List of concept IDs user failed often
  simBestScore: number; // Lowest risk score achieved (lower is better, or inverted)
  completedMissions: string[];
  classRules: string;
}

export interface DailyMission {
  id: string;
  date: string;
  title: string;
  description: string;
  completed: boolean;
}