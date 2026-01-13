export type TabId = 'concept' | 'simulation' | 'more-info' | 'quiz' | 'reflection';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  productivityBonus: number;
  laborReduction: number;
  type: 'sensor' | 'automation' | 'ai';
  icon: string;
}

export interface GameState {
  money: number;
  productivity: number; // 0 to 100+
  labor: number; // 100 (high labor) to 0 (fully automated)
  pigsHealth: number; // 0 to 100
  pigsCount: number;
  installedUpgrades: string[];
  day: number;
  history: { day: number; money: number }[];
  lastEvent: string | null;
}

export interface QuizItem {
  id: string;
  term: string;
  definition: string;
}

export const UPGRADES: Upgrade[] = [
  {
    id: 'temp_sensor',
    name: '온도/습도 센서',
    description: '축사 환경을 실시간으로 모니터링하여 돼지의 스트레스를 줄입니다.',
    cost: 1500,
    productivityBonus: 15,
    laborReduction: 10,
    type: 'sensor',
    icon: '🌡️'
  },
  {
    id: 'auto_feeder',
    name: '자동 급식기',
    description: '정해진 시간에 정량을 급여하여 성장을 돕고 노동력을 줄입니다.',
    cost: 3000,
    productivityBonus: 25,
    laborReduction: 30,
    type: 'automation',
    icon: '🤖'
  },
  {
    id: 'ai_diagnosis',
    name: 'AI 질병 진단 시스템',
    description: '빅데이터로 질병 징후를 조기에 포착하여 전염병을 예방합니다.',
    cost: 8000,
    productivityBonus: 50,
    laborReduction: 20,
    type: 'ai',
    icon: '🧠'
  }
];