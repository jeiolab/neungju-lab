import { UserStats, DailyMissionState } from '../types';
import { formatDate } from '../constants';

const STATS_KEY = 'search_mission_stats';
const HISTORY_KEY = 'search_mission_history';

const INITIAL_STATS: UserStats = {
  streak: 0,
  lastMissionDate: '',
  totalXP: 0,
  level: 1,
  badges: [],
};

export const getUserStats = (): UserStats => {
  const stored = localStorage.getItem(STATS_KEY);
  return stored ? JSON.parse(stored) : INITIAL_STATS;
};

export const saveUserStats = (stats: UserStats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const getMissionHistory = (): Record<string, DailyMissionState> => {
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const completeMission = (date: string, score: number) => {
  const history = getMissionHistory();
  if (history[date]?.completed) return; // Already completed

  const stats = getUserStats();
  const today = formatDate(new Date());

  // Streak logic
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  if (stats.lastMissionDate === yesterdayStr) {
    stats.streak += 1;
  } else if (stats.lastMissionDate !== today) {
    stats.streak = 1;
  }
  
  stats.lastMissionDate = today;
  stats.totalXP += score;
  
  // Level up logic (Simple implementation)
  stats.level = Math.floor(stats.totalXP / 100) + 1;

  // Badges
  if (stats.streak >= 7 && !stats.badges.includes('7_DAY_STREAK')) {
    stats.badges.push('7_DAY_STREAK');
  }
  if (stats.streak >= 30 && !stats.badges.includes('30_DAY_STREAK')) {
    stats.badges.push('30_DAY_STREAK');
  }

  history[date] = {
    date,
    completed: true,
    score,
  };

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  saveUserStats(stats);
};
