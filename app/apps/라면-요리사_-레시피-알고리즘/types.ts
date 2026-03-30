export type TabId = 'theory' | 'simulation' | 'learn' | 'quiz' | 'think';

export enum BlockType {
  START_END = 'START_END',
  PROCESS = 'PROCESS', // General action
  DECISION = 'DECISION', // Yes/No check
}

export interface BlockDef {
  id: string;
  label: string;
  type: BlockType;
  icon?: string;
  description?: string;
}

export interface SimulationResult {
  success: boolean;
  message: string;
  title: string;
  level: '초보' | '견습 요리사' | '수석 셰프' | '마스터 셰프';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
