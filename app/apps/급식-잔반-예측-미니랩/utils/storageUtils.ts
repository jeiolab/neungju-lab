import { ExperimentLog, UserStats } from "../types";

const KEYS = {
  STATS: 'mini-lab-stats',
  LOGS: 'mini-lab-logs'
};

const INITIAL_STATS: UserStats = {
  points: 0,
  streak: 0,
  lastVisit: new Date().toISOString(),
  badges: [],
  quizScore: 0,
  masteryTags: []
};

export const getStats = (): UserStats => {
  const stored = localStorage.getItem(KEYS.STATS);
  if (!stored) return INITIAL_STATS;
  return JSON.parse(stored);
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
};

export const getLogs = (): ExperimentLog[] => {
  const stored = localStorage.getItem(KEYS.LOGS);
  if (!stored) return [];
  return JSON.parse(stored);
};

export const addLog = (log: ExperimentLog) => {
  const logs = getLogs();
  logs.unshift(log); // Add to beginning
  localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
};

export const updateStreak = () => {
  const stats = getStats();
  const today = new Date().toDateString();
  const lastVisit = new Date(stats.lastVisit).toDateString();
  
  if (today !== lastVisit) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (yesterday.toDateString() === lastVisit) {
      stats.streak += 1;
    } else {
      stats.streak = 1;
    }
    stats.lastVisit = new Date().toISOString();
    saveStats(stats);
  }
  return stats.streak;
};