export type TabType = 'theory' | 'simulation' | 'router' | 'quiz' | 'discussion';

export interface ScenarioOption {
  id: string;
  label: string;
  isCorrect: boolean;
  cost: 'low' | 'medium' | 'high'; // 'low' is better for score usually
  effectiveness: 'low' | 'medium' | 'high';
  feedback: string; // Internal logic feedback
}

export interface Scenario {
  id: string;
  customerName: string;
  problem: string;
  context: string; // e.g., "Many walls", "Open space"
  options: ScenarioOption[];
  tipReward?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  timestamp: Date;
}

export interface RouterConfig {
  ssid: string;
  password: string;
  securityMode: 'Open' | 'WPA2-PSK' | 'WPA3-SAE';
  frequency: '2.4GHz' | '5GHz';
  channel: number;
  txPower: 'Low' | 'Medium' | 'High';
}

export interface QuizQuestion {
  id: number;
  question: string;
  answer: 'O' | 'X';
  explanation: string;
}
