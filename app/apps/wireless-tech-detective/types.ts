export enum TechType {
  WIFI = 'Wi-Fi',
  BLUETOOTH = '블루투스',
  NFC = 'NFC',
  CELLULAR = '이동통신(4G/5G)'
}

export enum ReasonType {
  DISTANCE = '거리(단거리/장거리)',
  SPEED = '전송 속도',
  SECURITY = '보안 중요',
  INTERFERENCE = '간섭/장애물',
  PAIRING = '페어링 필요',
  AUTH_PAYMENT = '결제/인증'
}

export interface Question {
  id: number;
  scenario: string;
  correctTech: TechType;
  correctReasons: ReasonType[]; // Up to 2 key reasons
  explanation: string; // The "basis" (2 lines)
  tip: string; // The "tip" (1 line)
  difficulty: '초급' | '중급' | '고급';
}

export interface GameState {
  currentQuestionIndex: number;
  score: number; // Current round score (0-100)
  totalScore: number; // XP
  streak: number;
  level: number;
  history: NoteItem[];
}

export interface NoteItem {
  id: number;
  questionId: number;
  scenario: string;
  correctTech: TechType;
  userTech: TechType | null;
  isCorrect: boolean;
  explanation: string;
  tip: string;
  timestamp: number;
}




