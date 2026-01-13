export enum Tab {
  THEORY = 'THEORY',
  GAME = 'GAME',
  MORE_INFO = 'MORE_INFO',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION',
}

export enum ItemType {
  SENSOR = 'SENSOR',
  ACTUATOR = 'ACTUATOR',
}

export interface GameItem {
  id: string;
  name: string;
  type: ItemType;
  icon: string;
  description: string;
  targetCondition?: 'water' | 'temp' | 'light' | 'bug';
}

export interface GrowthLog {
  id: string;
  timestamp: number;
  stage: number; // 0: Seed, 1: Sprout, 2: Plant, 3: Fruit
  message: string;
}

export interface PlantState {
  health: number;
  stage: number; // 0 to 3
  needs: 'none' | 'water' | 'temp' | 'light' | 'bug';
  message: string;
}

export interface RadioState {
  senderGroupId: number;
  receiverGroupId: number;
  isTransmitting: boolean;
}
