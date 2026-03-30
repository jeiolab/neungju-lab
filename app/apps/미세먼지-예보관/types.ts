export enum Tab {
  CORRELATION = 'correlation',
  SIMULATOR = 'simulator',
  SDGS = 'sdgs'
}

export enum ModelType {
  LINEAR_REGRESSION = 'linear',
  SIMPLE_AVERAGE = 'average'
}

export interface SimulationState {
  humidity: number; // 0-100 %
  windSpeed: number; // 0-20 m/s
  traffic: number; // 0-100 index
  factoryRate: number; // 0-100 %
}

export interface DailyMission {
  targetPM25: number;
  fixedHumidity: number;
  fixedWind: number;
  fixedFactory: number;
  description: string;
  solved: boolean;
}

export interface UserStats {
  score: number;
  streak: number;
  lastLoginDate: string;
  missionsSolved: number;
}