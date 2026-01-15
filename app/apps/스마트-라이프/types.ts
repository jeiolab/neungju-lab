import { LucideIcon } from 'lucide-react';

export enum Tab {
  CONCEPT = 'concept',
  SIMULATION = 'simulation',
  DEEP_DIVE = 'deep_dive',
  QUIZ = 'quiz',
  DISCUSSION = 'discussion'
}

export interface NavItem {
  id: Tab;
  label: string;
  icon: LucideIcon;
}

export interface ConceptCardData {
  title: string;
  description: string;
  detail: string;
  iconName: 'IoT' | 'AI' | 'Wearable';
}

export interface SmartDevice {
  id: string;
  name: string;
  description: string;
  effectMessage: string;
  score: number;
  iconName: 'Speaker' | 'Vacuum' | 'Light' | 'Fridge';
}

export interface QuizQuestion {
  id: number;
  question: string;
  answer: boolean; // true for O, false for X
  explanation: string;
}

export interface Comment {
  id: number;
  text: string;
  date: string;
}