import React from 'react';

export enum DataType {
  INT = 'int',
  FLOAT = 'float',
  STR = 'str',
  BOOL = 'bool',
  VARIABLE = 'variable', // For concept cards
  ASSIGNMENT = 'assignment' // For concept cards
}

export interface Concept {
  id: string;
  title: string;
  definition: string;
  keywords: string[];
  example: string;
  misconception: string;
  checkQuestion: string;
  checkAnswer: string; // Simple answer for self-check
  type: DataType;
}

export interface GameItem {
  id: string;
  value: string; // The display text, e.g., "17", "3.14", '"hello"'
  type: DataType;
  displayValue?: React.ReactNode;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options?: string[]; // If null, it's short answer
  correctAnswer: string;
  explanation: string;
  type: DataType; // Related concept
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string | null; // ISO Date string
  mastery: Record<string, number>; // conceptId -> 0-100
  badges: string[]; // Badge IDs
  wrongNotes: WrongNote[];
  completedDailyMission: string | null; // Date string of completed mission
}

export interface WrongNote {
  id: string;
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  concept: DataType;
  timestamp: number;
}

export interface SavedThinkAnswer {
  questionId: string;
  answer: string;
  updatedAt: number;
}

export const INITIAL_STATS: UserStats = {
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: null,
  mastery: {
    [DataType.INT]: 0,
    [DataType.FLOAT]: 0,
    [DataType.STR]: 0,
    [DataType.BOOL]: 0,
    [DataType.VARIABLE]: 0,
    [DataType.ASSIGNMENT]: 0,
  },
  badges: [],
  wrongNotes: [],
  completedDailyMission: null
};