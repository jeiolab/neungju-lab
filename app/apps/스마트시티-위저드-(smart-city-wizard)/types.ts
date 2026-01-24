export enum Stakeholder {
  STUDENT = '학생',
  RESIDENT = '주민',
  ADMIN = '관리자/공무원',
  TEACHER = '교사',
  PARENT = '학부모'
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  defaultDNPC: {
    device: string;
    network: string;
    platform: string;
    service: string;
  };
}

export interface ProjectData {
  scenarioId: string;
  stakeholders: Stakeholder[];
  dnpc: {
    device: string;
    network: string;
    platform: string;
    service: string;
  };
  risks: string[];
  reflection: string;
  title: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // index
  explanation: string;
}

export interface CaseStudy {
  id: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
}
