export enum SensorType {
  PHOTO_ONLY = 'PHOTO_ONLY',
  PHOTO_MOTION = 'PHOTO_MOTION',
}

export enum GameState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
}

export interface SimulationConfig {
  luxThreshold: number; // 0-1000
  sensorType: SensorType;
}

export interface SimulationStats {
  safetyScore: number;
  energyScore: number;
  totalScore: number;
  dayCount: number;
}

export interface TimePoint {
  hour: number;
  lux: number;
  traffic: number;
  power: number;
  isLightOn: boolean;
}

export type UserLevel = '인턴 설계자' | '주니어 엔지니어' | '시니어 엔지니어' | '수석 엔지니어';
