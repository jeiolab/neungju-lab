import { LucideIcon } from 'lucide-react';

export enum ComponentType {
  SENSOR = 'sensor',
  NETWORK = 'network',
  PLATFORM = 'platform',
  ACTUATOR = 'actuator', // Output/Service
}

export interface IoTComponent {
  id: string;
  name: string;
  type: ComponentType;
  description: string;
  iconName: string; // We'll map this to actual icons
}

export interface Level {
  id: number;
  title: string;
  mission: string;
  description: string;
  slots: {
    id: string;
    label: string;
    acceptedTypes: ComponentType[];
  }[];
  solution: Record<string, string>; // slotId -> componentId
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface GameState {
  currentLevelId: number;
  placedComponents: Record<string, string | null>; // slotId -> componentId
  isSuccess: boolean;
  isPlaying: boolean; // Simulation running
  feedback: string | null;
  showConfetti: boolean;
}
