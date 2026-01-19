export enum DetectiveRank {
  ROOKIE = '신입 탐정',
  SENIOR = '경력 탐정',
  CHIEF = '수석 탐정',
  LEGEND = '전설의 수사관'
}

export interface CaseAttributes {
  hasBigData: boolean; // 데이터 양
  hasPattern: boolean; // 규칙성 유무
  isCreativeOrRandom: boolean; // 창의성/무작위성 (부정적 요인 for traditional ML)
}

export interface CaseFile {
  id: string;
  title: string;
  description: string;
  category: 'textbook' | 'daily' | 'generated';
  difficulty: number;
  isSolvable: boolean; // ML로 해결 가능한가?
  correctAttributes: CaseAttributes;
  explanation: string; // Detective's feedback
}

export interface UserHistory {
  caseId: string;
  caseTitle: string;
  userVerdict: boolean; // User thought it was solvable/insolvable
  isCorrect: boolean;
  timestamp: number;
}

export interface UserStats {
  score: number;
  solvedCount: number;
  consecutiveWins: number;
  rank: DetectiveRank;
  history: UserHistory[];
}