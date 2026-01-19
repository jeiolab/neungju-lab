// 학습 카드 데이터 구조
export interface LearningCard {
  id: string;
  category: 'intro' | 'weak' | 'strong' | 'role';
  title: string;
  definition: string;
  keywords: string[];
  example: string; // 학교생활/친구/진로 예시
  misconception: {
    statement: string;
    correction: string;
  };
  checkQuestion: {
    question: string;
    type: 'OX' | 'SHORT';
    answer: string; // O, X, or short word
  };
}

// 퀴즈 문항 구조
export interface QuizQuestion {
  id: string;
  difficulty: 'easy' | 'normal' | 'hard';
  type: 'multiple' | 'short' | 'essay';
  question: string;
  options?: string[]; // 객관식 보기
  correctAnswer: string | string[]; // 정답 (단답형은 배열로 허용답안)
  keywords?: string[]; // 서술형 채점용 키워드
  explanation: string; // 오답 피드백 (왜 틀렸는지)
  correction: string; // 교정 내용
  retryQuestion?: { // 재도전 문항
    question: string;
    answer: string;
    type: 'short' | 'OX';
  };
  conceptTag: string; // 취약 개념 분석용
}

// 용어 사전 아이템
export interface DictItem {
  id: string;
  term: string;
  description: string;
}

// 사용자 진행 상태 (localStorage: rolecards_progress_v1)
export interface CardProgress {
  mastery: number; // 0-100
  learnCount: number;
  lastLearned: string; // ISO Date
}

export interface ProgressData {
  [cardId: string]: CardProgress;
}

// 퀴즈 기록 (localStorage: rolecards_quiz_v1)
export interface QuizRecord {
  timestamp: string;
  score: number;
  difficulty: 'easy' | 'normal' | 'hard';
  wrongIds: string[];
}

// 오답 노트 (localStorage: rolecards_wrongnote_v1)
export interface WrongNote {
  questionId: string;
  timestamp: string;
  userAnswer: string;
  conceptTag: string;
  difficulty: 'easy' | 'normal' | 'hard';
  mastery: number; // 개념별 숙련도
}

// 동기부여 데이터 (localStorage: rolecards_motivation_v1)
export interface MotivationData {
  xp: number;
  level: number;
  badges: string[]; // badge IDs
  streak: number;
  lastActivityDate: string; // YYYY-MM-DD
  dailyActivities: number; // 당일 활동 횟수 (2회 이상 시 스트릭 인정)
}

// 배지 정의
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (progress: ProgressData, motivation: MotivationData, wrongNotes: WrongNote[]) => boolean;
}
