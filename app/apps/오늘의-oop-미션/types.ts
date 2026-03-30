export enum MissionType {
  SHARED_STATE_DELUSION = '인스턴스 상태 공유 착각',
  METHOD_CONTEXT_CONFUSION = '메서드 호출 주체(this) 혼동',
  CONSTRUCTOR_MISSING = '속성 초기화 누락(생성자)',
}

export interface Mission {
  id: number;
  type: MissionType;
  title: string;
  context: string;
  buggyCode: string;
  bugDescription: string;
  fixExplanation: string;
  correctedCode: string;
}

export interface QuizQuestion {
  id: number;
  difficulty: '쉬움' | '보통' | '어려움';
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface UserProgress {
  lastLoginDate: string;
  currentStreak: number;
  maxStreak: number;
  completedMissions: number[]; // Array of Mission IDs
  missionHistory: Record<string, boolean>; // Date string -> Success
  quizScore: number;
  weaknessStats: Record<MissionType, number>; // Type -> Failure count
  badges: string[];
}

export interface ReflectionPrompt {
  id: number;
  title: string;
  content: string;
}