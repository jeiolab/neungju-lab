export type TabId = 'THEORY' | 'SIMULATION' | 'RELATIONSHIPS' | 'QUIZ' | 'DISCUSSION';

export enum Role {
  HUMAN = 'HUMAN',
  AI = 'AI',
  COLLAB = 'COLLAB',
}

export enum ProjectStage {
  PLANNING = '기획 (Planning)',
  DESIGN = '설계 (Design)',
  VERIFICATION = '검증 (Verification)',
  PRODUCTION = '생산/결정 (Production)',
}

export interface SimulationState {
  currentStageIndex: number;
  efficiency: number;
  risk: number;
  history: {
    stage: ProjectStage;
    choice: Role;
    efficiencyDelta: number;
    riskDelta: number;
  }[];
  isComplete: boolean;
  eventLog: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface RelationshipType {
  title: string;
  description: string;
  example: string;
  icon: string;
}
