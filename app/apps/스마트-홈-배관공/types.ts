export enum ComponentType {
  SENSOR = 'SENSOR',
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  ACTUATOR = 'ACTUATOR',
  GATEWAY = 'GATEWAY'
}

export interface GameItem {
  id: string;
  name: string;
  type: ComponentType;
  icon: string;
  description: string;
}

export interface LevelConfig {
  id: number;
  title: string;
  description: string;
  slots: number;
  requiredSequence: ComponentType[];
  availableItems: GameItem[];
  scenario: string;
  difficulty: '초보 기사' | '숙련된 엔지니어';
}

export enum Rank {
  BRONZE = '브론즈 렌치',
  SILVER = '실버 렌치',
  GOLD = '골드 렌치'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}