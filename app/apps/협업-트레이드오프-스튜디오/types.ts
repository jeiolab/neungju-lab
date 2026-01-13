export interface SimulationState {
  aiUsage: number; // 0-100
  verificationTime: number; // 0-100
  isSensitive: boolean; // Toggle
}

export interface SimulationResult {
  id: string;
  timestamp: number;
  input: SimulationState;
  scores: {
    efficiency: number;
    quality: number;
    ethics: number;
    total: number;
  };
  feedback: {
    efficiency: string;
    quality: string;
    ethics: string;
  };
  scenario: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  tags: string[]; // e.g., '협업', '검증', '윤리'
}

export interface UserStats {
  simulationCount: number;
  quizScore: number;
  badges: string[];
  streak: number;
  lastVisit: string; // ISO date string
  highEthicsCount: number; // For the specific badge
}

export enum ScenarioType {
  REPORT = '수행평가 보고서',
  PROMOTION = '학교 축제 홍보물',
  SURVEY = '동아리 설문 분석',
}

export interface RoleItem {
  id: string;
  name: string;
  type: 'human' | 'ai';
}

export interface AssignmentState {
  human: RoleItem[];
  ai: RoleItem[];
  verification: RoleItem[];
  data: RoleItem[];
  pool: RoleItem[];
}