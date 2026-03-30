export type DataCategory = 'Volume' | 'Velocity' | 'Variety' | 'SmallData';

export interface DataItemDef {
  id: string;
  name: string;
  category: DataCategory[]; // Can belong to multiple 3Vs
  iconName: 'video' | 'file-spreadsheet' | 'cctv' | 'message-circle' | 'cloud-lightning';
  description: string;
  color: string;
}

export interface FloatingItemInstance extends DataItemDef {
  instanceId: string; // Unique ID for React keys
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  duration: number; // Animation speed
  delay: number;
}

export type JobTitle = '데이터 분석가 인턴' | '데이터 팀장' | 'CTO (최고 기술 경영자)';

export interface GameState {
  score: number;
  level: number; // 0: Intern, 1: Lead, 2: CTO
  volume: number; // PB
  velocity: number; // ms
  variety: number; // Index 0-100
  isGameActive: boolean;
  currentMissionIndex: number;
  showConcept: boolean;
  showQuiz: boolean;
  feedback: {
    visible: boolean;
    isCorrect: boolean;
    message: string;
  } | null;
}

export interface Mission {
  target: DataCategory;
  title: string;
  description: string;
}