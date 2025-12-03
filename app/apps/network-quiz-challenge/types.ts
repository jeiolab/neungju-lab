export enum Difficulty {
  BASIC = '초급',
  NORMAL = '중급',
  CHALLENGE = '고급',
}

export enum QuestionType {
  MULTIPLE_CHOICE = '객관식',
  OX = 'OX',
  SHORT_ANSWER = '단답형',
}

export interface QuizSettings {
  count: number;
  difficulty: Difficulty;
}

export interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  relatedConcept: string;
}

export interface UserAnswer {
  questionId: string;
  userInput: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface QuizSessionState {
  questions: Question[];
  answers: UserAnswer[];
  currentIndex: number;
  score: number;
  status: 'SETUP' | 'LOADING' | 'QUIZ' | 'REVIEW' | 'REPORT';
  loadingMessage?: string;
}

export const TOPICS = [
  "전체 (종합)",
  "컴퓨팅 시스템과 네트워크",
  "전송 매체 (유선/무선)",
  "네트워크 장비 (공유기, 허브 등)",
  "무선 통신 (Wi-Fi, Bluetooth, NFC)",
  "IP 주소, 게이트웨이, DNS",
  "파일 및 프린터 공유",
  "핫스팟과 테더링",
  "정보 보안과 디지털 시민 의식"
];

