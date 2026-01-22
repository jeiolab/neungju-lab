import React from 'react';

export type TabType = 'theory' | 'wizard' | 'learn' | 'quiz' | 'think';

export interface WizardState {
  step: number;
  serviceName: string;
  serviceDescription: string;
  collectedData: string[];
  threats: string[];
  securityTech: {
    passwordStorage: string;
    communication: string;
    personalData: string;
    authentication: string;
  };
  operations: {
    keyManagement: string;
    logging: string;
    retention: string;
  };
  score: number;
  badges: string[];
  isComplete: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // index
  explanation: string;
}

export interface ThinkQuestion {
  id: number;
  type: 'condition' | 'counter' | 'design';
  title: string;
  description: string;
  placeholder: string;
}

export interface TheoryCardData {
  title: string;
  icon: React.ReactNode;
  summary: string;
  detail: string;
  example: string;
  color: string;
}