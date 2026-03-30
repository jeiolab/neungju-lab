import React from 'react';

export interface UserState {
  name: string;
  coins: number;
  badges: string[];
  level: number;
  wrongAnswers: WrongAnswer[];
}

export interface WrongAnswer {
  id: string;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
  timestamp: number;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  scenario: string;
  options: MissionOption[];
  correctId: string;
  feedbackCorrect: string;
  feedbackWrong: string;
}

export interface MissionOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isEthical?: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export enum Tab {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  MORE_INFO = 'more_info',
  QUIZ = 'quiz',
  DISCUSSION = 'discussion',
}