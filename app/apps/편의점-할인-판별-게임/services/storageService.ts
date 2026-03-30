import { UserStats } from '../types';

const STORAGE_KEY = 'cvstore_v1_stats';
const WRONG_NOTES_KEY = 'cvstore_v1_wrongNotes';

const INITIAL_STATS: UserStats = {
  points: 0,
  level: 1,
  badges: [],
  streak: 0,
  lastPlayedDate: '',
  mastery: {
    comparison: 0,
    logic: 0,
    membership: 0,
  },
  wrongNotes: [],
};

export const getStats = (): UserStats => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_STATS;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_STATS;
  }
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const updateStreak = (currentStats: UserStats): UserStats => {
  const today = new Date().toDateString();
  if (currentStats.lastPlayedDate === today) {
    return currentStats; // Already played today
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  let newStreak = 1;
  if (currentStats.lastPlayedDate === yesterday.toDateString()) {
    newStreak = currentStats.streak + 1;
  }

  const newStats = {
    ...currentStats,
    streak: newStreak,
    lastPlayedDate: today,
  };
  saveStats(newStats);
  return newStats;
};

export const addBadge = (stats: UserStats, badgeId: string): UserStats => {
  if (stats.badges.includes(badgeId)) return stats;
  const newStats = {
    ...stats,
    badges: [...stats.badges, badgeId],
  };
  saveStats(newStats);
  return newStats;
};

export const saveWrongNote = (questionId: number) => {
  const stats = getStats();
  if (!stats.wrongNotes.includes(questionId)) {
    const newStats = { ...stats, wrongNotes: [...stats.wrongNotes, questionId] };
    saveStats(newStats);
  }
};

export const removeWrongNote = (questionId: number) => {
  const stats = getStats();
  const newStats = {
    ...stats,
    wrongNotes: stats.wrongNotes.filter((id) => id !== questionId),
  };
  saveStats(newStats);
  return newStats;
};