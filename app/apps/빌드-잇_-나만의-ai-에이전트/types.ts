export enum ModuleType {
  SENSOR = 'SENSOR',
  DATA = 'DATA',
  ALGORITHM = 'ALGORITHM',
  ACTUATOR = 'ACTUATOR'
}

export interface AgentModule {
  id: string;
  name: string;
  type: ModuleType;
  icon: string;
  description: string;
}

export interface AgentDesign {
  id: string;
  name: string;
  goal: string;
  sensors: AgentModule[];
  data: AgentModule[];
  algorithm: AgentModule[];
  actuators: AgentModule[];
  createdAt: number;
  feedback?: string;
  status: 'draft' | 'tested' | 'failed';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface DailyChallenge {
  topic: string;
  description: string;
}

export interface UserProfile {
  savedAgents: AgentDesign[];
  completedDailyChallenge: boolean;
}