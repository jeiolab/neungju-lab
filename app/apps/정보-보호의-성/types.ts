export enum Tab {
  CONCEPT = 'CONCEPT',
  SIMULATION = 'SIMULATION',
  LEARN_MORE = 'LEARN_MORE',
  QUIZ = 'QUIZ',
  THINK = 'THINK'
}

export enum SecurityType {
  CONFIDENTIALITY = 'CONFIDENTIALITY', // 기밀성
  INTEGRITY = 'INTEGRITY',             // 무결성
  AVAILABILITY = 'AVAILABILITY'        // 가용성
}

export interface Knight {
  id: SecurityType;
  name: string;
  koreanName: string;
  description: string;
  iconName: string;
  color: string;
}

export interface AttackScenario {
  id: number;
  title: string;
  description: string;
  requiredDefense: SecurityType;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options?: string[]; // If undefined, it's OX
  answer: string;
  explanation: string;
  type: 'OX' | 'MULTIPLE_CHOICE';
}
