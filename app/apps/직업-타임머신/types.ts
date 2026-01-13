export type TabType = 'concept' | 'simulation' | 'explore' | 'quiz' | 'reflection';

export enum JobType {
  PAST = 'PAST',
  FUTURE = 'FUTURE'
}

export interface JobCard {
  id: number;
  title: string;
  type: JobType;
  description: string;
  imageKeyword: string; // for picsum
}

export interface QuizItem {
  id: number;
  chosung: string;
  answer: string;
  hint: string;
}

export interface SkillData {
  subject: string;
  A: number;
  fullMark: number;
}
