import { Action, CellType } from "./types";

export const GRID_ROWS = 5;
export const GRID_COLS = 5;

export const ACTIONS: Action[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

export const INITIAL_EPSILON = 1.0;
export const MIN_EPSILON = 0.01;
export const EPSILON_DECAY = 0.995;
export const LEARNING_RATE = 0.1;
export const DISCOUNT_FACTOR = 0.9;

export const REWARDS = {
  [CellType.GOAL]: 100,
  [CellType.DANGER]: -50,
  [CellType.WALL]: -5, // Penalty for hitting a wall
  [CellType.EMPTY]: -1, // Small penalty to encourage shortest path
  [CellType.BONUS]: 10,
  [CellType.START]: -1,
};

export const MAX_STEPS_PER_EPISODE = 100;
