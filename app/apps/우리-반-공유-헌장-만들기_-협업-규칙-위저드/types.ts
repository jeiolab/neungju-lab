export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  THEORY = 'THEORY',
  WIZARD = 'WIZARD',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION',
}

export interface CharterData {
  target: string[];
  scope: string;
  permissions: string[];
  security: string[];
  copyright: string[];
  response: string;
  customRule: string;
  lastUpdated: number;
}

export interface HistoryItem {
  timestamp: number;
  data: CharterData;
}

export interface UserProgress {
  badges: string[];
  quizScore: number; // 0-100
  streak: number;
  lastVisit: number;
  history: HistoryItem[];
  quizMistakes: string[]; // Topics related to mistakes
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  relatedTopic: string; // e.g., 'permissions', 'security'
  explanation: string;
}

export const TOPIC_MAPPING: Record<string, string> = {
  'permissions': '권한 설정 (3단계)',
  'security': '보안 규칙 (4단계)',
  'copyright': '저작권/개인정보 (5단계)',
  'response': '문제 대응 (6단계)',
  'scope': '공유 범위 (2단계)',
  'target': '공유 대상 (1단계)'
};