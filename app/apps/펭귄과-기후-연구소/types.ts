export enum Species {
  Adelie = 'Adelie',
  Chinstrap = 'Chinstrap',
  Gentoo = 'Gentoo'
}

export interface PenguinData {
  id: number;
  species: Species;
  beakLength: number; // Culmen Length (mm)
  flipperLength: number; // Flipper Length (mm)
  color: string;
}

export interface ClimateData {
  year: number;
  tempAnomaly: number; // Global temperature anomaly relative to baseline
}

export enum AppTab {
  Guide = 'guide',
  DataLab = 'datalab',
  Climate = 'climate'
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface ResearchState {
  level: number;
  xp: number;
  maxXp: number;
  completedTasks: string[];
}