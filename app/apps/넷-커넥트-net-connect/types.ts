export enum TechType {
  BLUETOOTH = 'Bluetooth',
  WIFI = 'Wi-Fi',
  NFC = 'NFC',
  RFID = 'RFID',
  FIVE_G = '5G',
  LTE = 'LTE',
  IOT = 'IoT'
}

export interface TechCard {
  id: TechType;
  name: string;
  description: string;
  features: string[]; // e.g., 거리, 속도
  usage: string[];
  icon: string;
}

export interface QuizQuestion {
  id: string;
  scenario: string;
  correctTech: TechType;
  explanation: string;
  options: TechType[];
}

export interface SimulationItem {
  id: string;
  name: string;
  tech: TechType;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  icon: any;
}

export type Tab = 'theory' | 'simulation' | 'more' | 'quiz' | 'discussion';
