export type PlayerLevel = '초보 사용자' | '디지털 탐험가' | '똑똑한 디지털 시민' | '네트워크 마스터';

export interface GameStats {
  data: number;    // 0-100%
  battery: number; // 0-100%
  security: number;// 0-100%
  exp: number;     // Experience points
}

export interface Choice {
  id: string;
  label: string;
  description: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  location: string;
  choices: Choice[];
}

export interface GameState {
  stats: GameStats;
  level: PlayerLevel;
  currentScenario: Scenario | null;
  turn: number;
  gameOver: boolean;
  history: string[];
}

export interface EvaluationResult {
  outcomeMessage: string;
  acquiredKnowledge: string;
  statChanges: {
    data: number;
    battery: number;
    security: number;
    exp: number;
  };
  success: boolean;
  nextScenarioPreview?: string;
}
