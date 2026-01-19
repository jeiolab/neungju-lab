import { UserStats, LogEntry, ScenarioTag } from '../types';
import { SCENARIOS } from '../constants';

const STORAGE_KEY_STATS = 'smishing_defense_stats';
const STORAGE_KEY_LOGS = 'smishing_defense_logs';
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const INITIAL_STATS: UserStats = {
  xp: 0,
  level: 'TRAINEE',
  streak: 0,
  lastPlayed: new Date().toISOString(),
  vulnerabilities: {
    URGENCY: 0,
    CURIOSITY: 0,
    AUTHORITY: 0,
    Fear: 0,
    GREED: 0,
  },
  badges: [],
  simulationsCompleted: 0,
  quizScore: 0,
};

export const getStats = (): UserStats => {
  if (!isBrowser) return INITIAL_STATS;
  const stored = localStorage.getItem(STORAGE_KEY_STATS);
  if (!stored) return INITIAL_STATS;
  return JSON.parse(stored);
};

export const saveStats = (stats: UserStats) => {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
};

export const getLogs = (): LogEntry[] => {
  if (!isBrowser) return [];
  const stored = localStorage.getItem(STORAGE_KEY_LOGS);
  if (!stored) return [];
  return JSON.parse(stored);
};

export const addLog = (log: LogEntry) => {
  if (!isBrowser) return;
  const logs = getLogs();
  logs.unshift(log); // Add to beginning
  localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs.slice(0, 50))); // Keep last 50
};

export const calculateLevel = (xp: number): UserStats['level'] => {
  if (xp >= 300) return 'CAPTAIN';
  if (xp >= 100) return 'DEFENDER';
  return 'TRAINEE';
};

export const updateVulnerability = (tags: ScenarioTag[]) => {
  const stats = getStats();
  tags.forEach(tag => {
    if (stats.vulnerabilities[tag] !== undefined) {
      stats.vulnerabilities[tag] += 1;
    }
  });
  saveStats(stats);
};

export const addXP = (amount: number) => {
  const stats = getStats();
  stats.xp += amount;
  stats.level = calculateLevel(stats.xp);
  
  // Badge check (Simple implementation)
  if (stats.xp >= 300 && !stats.badges.includes('MASTER_DEFENDER')) {
    stats.badges.push('MASTER_DEFENDER');
  }
  
  saveStats(stats);
  return stats;
};