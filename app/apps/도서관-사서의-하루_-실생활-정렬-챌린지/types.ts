export enum SortType {
  INSERTION = 'INSERTION',
  SELECTION = 'SELECTION',
}

export enum UserLevel {
  APPRENTICE = '견습 사서',
  EXPERT = '정렬의 달인',
  CHIEF = '수석 사서',
}

export interface Book {
  id: string;
  callNumber: number; // Simplified call number (e.g., 800.12)
  label: string; // Display text like "800.12 김"
  color: string;
}

export interface ExamPaper {
  id: string;
  studentNumber: number;
  name: string;
}

export interface UserStats {
  xp: number;
  level: UserLevel;
  insertionSuccess: number;
  selectionSuccess: number;
  dailyMission: string;
  missionProgress: number;
  missionTarget: number;
  missionCompleted: boolean;
}
