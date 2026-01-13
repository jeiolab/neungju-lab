export enum DeviceType {
  ROUTER = 'ROUTER',
  SWITCH = 'SWITCH',
  AP = 'AP',
  PC = 'PC',
  LAPTOP = 'LAPTOP',
  PRINTER = 'PRINTER',
  TABLET = 'TABLET',
  INTERNET = 'INTERNET'
}

export enum ConnectionType {
  WIRED = 'WIRED',
  WIRELESS = 'WIRELESS'
}

export interface Device {
  id: string;
  type: DeviceType;
  x: number;
  y: number;
  name: string;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConnectionType;
}

export enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  IOT = 'IOT',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION'
}

export interface SimulationState {
  devices: Device[];
  connections: Connection[];
  score: number;
  feedback: string;
  badges: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}