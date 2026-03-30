import { UserStats } from '../types';

const STORAGE_KEY = 'bodycheck_user_stats';

const INITIAL_STATS: UserStats = {
  xp: 0,
  badges: [],
  streak: 1, // Simulated streak
};

export const getStats = (): UserStats => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_STATS;
  } catch (e) {
    return INITIAL_STATS;
  }
};

export const updateStats = (newStats: Partial<UserStats>): UserStats => {
  const current = getStats();
  const updated = { ...current, ...newStats };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const addXP = (amount: number): UserStats => {
  const current = getStats();
  const updated = { ...current, xp: current.xp + amount };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
