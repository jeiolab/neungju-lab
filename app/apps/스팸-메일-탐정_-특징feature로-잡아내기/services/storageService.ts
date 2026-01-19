import { STORAGE_KEY_PREFIX, BADGES } from '../constants';
import { UserStats, SimulationResult } from '../types';

const STATS_KEY = `${STORAGE_KEY_PREFIX}stats`;
const HISTORY_KEY = `${STORAGE_KEY_PREFIX}history`;

const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  badges: [],
  simulationCount: 0,
  highAccuracyCount: 0,
  quizScore: 0,
};

export const loadUserStats = (): UserStats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
};

export const saveUserStats = (stats: UserStats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const addXP = (amount: number): UserStats => {
  const stats = loadUserStats();
  stats.xp += amount;
  
  // Level up logic: Level 1 (0-99), Level 2 (100-199)...
  const newLevel = Math.floor(stats.xp / 100) + 1;
  stats.level = newLevel;

  saveUserStats(stats);
  return stats;
};

export const checkBadges = (stats: UserStats): string[] => {
  const newBadges: string[] = [];

  if (stats.highAccuracyCount >= 3 && !stats.badges.includes(BADGES.FEATURE_MASTER)) {
    newBadges.push(BADGES.FEATURE_MASTER);
  }
  
  if (stats.quizScore >= 80 && !stats.badges.includes(BADGES.CONCEPT_MASTER)) {
     newBadges.push(BADGES.CONCEPT_MASTER);
  }

  if (stats.simulationCount >= 1 && !stats.badges.includes(BADGES.NEWBIE_DETECTIVE)) {
    newBadges.push(BADGES.NEWBIE_DETECTIVE);
  }

  if (newBadges.length > 0) {
    stats.badges = [...stats.badges, ...newBadges];
    saveUserStats(stats);
  }

  return newBadges;
};

export const loadHistory = (): SimulationResult | null => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const saveHistory = (result: SimulationResult) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(result));
};
