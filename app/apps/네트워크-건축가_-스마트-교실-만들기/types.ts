export enum AppTab {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  LEARN_MORE = 'learn_more',
  QUIZ = 'quiz',
  REFLECTION = 'reflection',
}

export enum SpaceType {
  HOME = 'HOME',
  CLASSROOM = 'CLASSROOM',
  CAFE = 'CAFE',
}

export enum EquipmentType {
  INTERNET_PLAN = 'INTERNET_PLAN',
  ROUTER = 'ROUTER',
  SWITCH = 'SWITCH',
  DEVICE = 'DEVICE',
}

export interface EquipmentItem {
  id: string;
  name: string;
  type: EquipmentType;
  cost: number;
  description: string;
  // Technical specs
  speedMbps?: number; // For Plans and Routers
  ports?: number; // For Routers and Switches
  deviceCount?: number; // For Devices (e.g. "5 Laptops")
  bandwidthUsage?: number; // For Devices
  icon: string;
}

export interface SimulationState {
  space: SpaceType | null;
  budget: number;
  maxBudget: number;
  inventory: EquipmentItem[];
  step: number; // 1: Space, 2: ISP, 3: Hardware, 4: Result
  history: SimulationResult[];
}

export interface SimulationResult {
  date: string;
  space: SpaceType;
  score: number;
  costScore: number;
  perfScore: number;
  valid: boolean;
  message: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
