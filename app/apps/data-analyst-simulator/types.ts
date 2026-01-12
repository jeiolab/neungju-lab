export enum Phase {
  HOME = 'HOME',
  COLLECTION = 'COLLECTION',
  PREPROCESSING = 'PREPROCESSING',
  RESULT = 'RESULT'
}

export type ScenarioType = 'REVIEWS' | 'SMART_FARM';

export enum ErrorType {
  MISSING = 'MISSING',
  OUTLIER = 'OUTLIER',
  DUPLICATE = 'DUPLICATE',
  NONE = 'NONE'
}

export interface DataRow {
  id: number;
  [key: string]: any;
  isDuplicate?: boolean;
}

export interface DatasetStats {
  initialErrors: number;
  fixedErrors: number;
  remainingErrors: number;
  qualityScore: number;
  timeTaken: number;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'Collection' | 'Preprocessing' | 'Analysis';
}
