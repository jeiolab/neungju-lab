export enum View {
  HOME = 'HOME',
  THEORY = 'THEORY',
  GAME = 'GAME',
  QUIZ = 'QUIZ',
  LEARN = 'LEARN',
  REFLECTION = 'REFLECTION'
}

export enum CompressionType {
  LOSSY = '손실 압축',
  LOSSLESS = '무손실 압축'
}

export enum Category {
  IMAGE = '이미지',
  AUDIO = '오디오',
  VIDEO = '비디오'
}

export interface Mission {
  id: string;
  scenario: string;
  category: Category;
  correctCompression: CompressionType;
  correctFormat: string;
  correctReasonKey: string; // Key to match with REASON_FRAGMENTS
  difficulty: 1 | 2 | 3;
}

export interface ReasonFragment {
  key: string;
  text: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  lastLoginDate: string;
  missionHistory: { [key: string]: boolean }; // missionId -> solved correctly
  wrongNotes: string[]; // List of mission IDs answered incorrectly
  quizMastery: number; // 0-100 score
}

export interface GameResult {
  missionId: string;
  isCorrect: boolean;
  userCompression: CompressionType | null;
  userFormat: string;
  userReasonKey: string;
  points: number;
}
