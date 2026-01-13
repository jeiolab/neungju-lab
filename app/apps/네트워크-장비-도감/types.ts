import { LucideIcon } from 'lucide-react';

export enum AppView {
  HOME = 'HOME',
  LEARN = 'LEARN',
  SIMULATION = 'SIMULATION',
  SUMMARY = 'SUMMARY',
  CERTIFICATE = 'CERTIFICATE'
}

export interface DeviceInfo {
  id: string;
  name: string;
  role: string;
  metaphor: string;
  description: string;
  techKey: string; // e.g., MAC Address, IP Address
  icon: LucideIcon;
  color: string;
}

export interface SimulationLevel {
  id: number;
  title: string;
  description: string;
  packetOrigin: string;
  packetDestination: string;
  question: string;
  options: {
    deviceId: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}