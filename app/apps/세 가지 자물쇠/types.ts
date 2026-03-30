export enum EncryptionType {
  SYMMETRIC = 'SYMMETRIC',
  ASYMMETRIC = 'ASYMMETRIC',
  HASH = 'HASH'
}

export interface ScenarioStep {
  id: number;
  description: string;
  actionRequired?: string;
}

export type Actor = 'ALICE' | 'BOB' | 'HACKER' | 'SYSTEM';

export interface Message {
  id: string;
  sender: Actor;
  text: string;
}

export interface ComparisonRow {
  feature: string;
  symmetric: string;
  asymmetric: string;
  hash: string;
}
