export enum CellType {
  EMPTY = 'EMPTY',
  WALL = 'WALL',
  START = 'START',
  GOAL = 'GOAL',
  DANGER = 'DANGER', // Fire/Trap (- Reward)
  BONUS = 'BONUS',   // Coin/Battery (+ Reward)
}

export interface Position {
  row: number;
  col: number;
}

export interface GridConfig {
  rows: number;
  cols: number;
}

export type Action = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface QTable {
  [key: string]: { [key in Action]: number };
}

export interface SimulationStats {
  episode: number;
  totalReward: number;
  steps: number;
  epsilon: number;
  wins: number;
}
