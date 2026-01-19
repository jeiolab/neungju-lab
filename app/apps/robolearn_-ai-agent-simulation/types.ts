export type TabId = 'theory' | 'simulation' | 'info' | 'quiz' | 'note';

export type CellType = 'empty' | 'wall' | 'dust';

// 0: Up, 1: Right, 2: Down, 3: Left
export type Direction = 0 | 1 | 2 | 3;

export type RobotAction = 'move' | 'turnLeft' | 'turnRight' | 'clean' | 'stop';

export interface GridCell {
  x: number;
  y: number;
  type: CellType;
}

export interface RobotState {
  x: number;
  y: number;
  direction: Direction;
  score: number;
  log: string[];
  lastThought: string;
  isActive: boolean;
}

export interface LogicRule {
  condition: CellType;
  action: RobotAction;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ComponentDetail {
  id: string;
  title: string;
  description: string;
  iconName: string;
}
