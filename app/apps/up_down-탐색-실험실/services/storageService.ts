import { UserStats, Badge } from '../types';
import { BADGES, INITIAL_STATS } from '../constants';

const STORAGE_KEY = 'updown_lab_stats_v1';

export const getStats = (): UserStats => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : INITIAL_STATS;
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const updateStatsAfterGame = (
  attempts: number,
  isWin: boolean,
  rangeKey: string, // e.g., "1-100"
  gameConfig: any,
  gameState: any
): { stats: UserStats; newBadges: Badge[] } => {
  if (!isWin) return { stats: getStats(), newBadges: [] };

  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];

  // Update Streak
  if (stats.lastPlayed !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (stats.lastPlayed === yesterdayStr) {
      stats.streak += 1;
    } else {
      stats.streak = 1;
    }
    stats.lastPlayed = today;
  }

  // Update Counts
  stats.totalGames += 1;
  stats.totalAttempts += attempts;

  // Update Best Record
  const currentBest = stats.bestAttempts[rangeKey] || Infinity;
  if (attempts < currentBest) {
    stats.bestAttempts[rangeKey] = attempts;
  }

  // Check Badges
  const newBadges: Badge[] = [];
  BADGES.forEach((badge) => {
    if (!stats.badges.includes(badge.id)) {
      if (badge.condition(stats, gameState, gameConfig)) {
        stats.badges.push(badge.id);
        newBadges.push(badge);
      }
    }
  });

  saveStats(stats);
  return { stats, newBadges };
};
