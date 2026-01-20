export enum Direction {
  NORTH = 'NORTH',
  EAST = 'EAST',
  SOUTH = 'SOUTH',
  WEST = 'WEST',
}

export enum CellType {
  EMPTY = 0,
  STUDENT = 1,
  WALL = 2,
  SERVED = 3, // Student who has received lunch
}

export enum CommandType {
  MOVE_FORWARD = 'MOVE_FORWARD',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  SERVE = 'SERVE',
  LOOP_START = 'LOOP_START',
  LOOP_END = 'LOOP_END',
}

export interface RobotState {
  x: number;
  y: number;
  direction: Direction;
}

export interface LevelConfig {
  id: number;
  name: string;
  grid: number[][]; // 2D array of CellType
  startPos: RobotState;
  maxCommands: number;
  description: string;
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success';
}

export enum GameStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface QuizQuestion {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
