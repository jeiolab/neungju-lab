export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTED = 'CONNECTED',
  UNSTABLE = 'UNSTABLE'
}

export interface SimulationConfig {
  dhcpEnabled: boolean;
  ipAddress: string;
  gateway: string;
  dns: string;
  wifiSsid: string; // Not stored permanently
  wifiPassword: string; // Not stored permanently
}

export interface SimulationResult {
  connectionScore: number; // 0-100
  securityScore: number; // 0-100
  speedScore: number; // 0-100
  status: ConnectionStatus;
  feedback: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface UserProgress {
  highScore: number;
  streak: number;
  lastLoginDate: string;
  badges: string[]; // Badge IDs
  historySummary: string[]; // Brief summary of experiments
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DailyMission {
  id: string;
  description: string;
  targetFault: 'DNS' | 'IP_MISMATCH' | 'WEAK_PW';
}