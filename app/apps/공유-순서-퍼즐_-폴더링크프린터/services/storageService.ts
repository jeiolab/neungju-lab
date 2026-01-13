import { UserStats, BadgeType } from '../types';
import { STORAGE_KEY } from '../constants';

const INITIAL_STATS: UserStats = {
  score: 0,
  level: 1,
  badges: [],
  solvedPuzzles: [],
  wrongAnswers: [],
  lastLoginDate: new Date().toISOString().split('T')[0],
  streakDays: 1,
};

export const getStats = (): UserStats => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATS));
    return INITIAL_STATS;
  }
  
  const stats: UserStats = JSON.parse(stored);
  
  // Check streak
  const today = new Date().toISOString().split('T')[0];
  if (stats.lastLoginDate !== today) {
    const last = new Date(stats.lastLoginDate);
    const curr = new Date(today);
    const diffTime = Math.abs(curr.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      stats.streakDays += 1;
    } else if (diffDays > 1) {
      stats.streakDays = 1; // Reset streak
    }
    stats.lastLoginDate = today;
    saveStats(stats);
  }
  
  return stats;
};

export const saveStats = (stats: UserStats) => {
  // Check for badges automatically
  const newBadges = [...stats.badges];

  if (stats.solvedPuzzles.length >= 1 && !newBadges.includes(BadgeType.BEGINNER)) {
    newBadges.push(BadgeType.BEGINNER);
  }
  if (stats.solvedPuzzles.length >= 3 && !newBadges.includes(BadgeType.ARCHITECT)) {
    newBadges.push(BadgeType.ARCHITECT);
  }
  if (stats.streakDays >= 3 && !newBadges.includes(BadgeType.STREAK)) {
    newBadges.push(BadgeType.STREAK);
  }

  const updatedStats = { ...stats, badges: newBadges };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats));
  return updatedStats;
};

export const recordPuzzleResult = (puzzleId: string, isSuccess: boolean, wrongStep?: string) => {
  const stats = getStats();
  if (isSuccess) {
    if (!stats.solvedPuzzles.includes(puzzleId)) {
      stats.solvedPuzzles.push(puzzleId);
      stats.score += 100;
      stats.level = Math.floor(stats.score / 200) + 1;
    }
  } else {
    if (wrongStep) {
      stats.wrongAnswers.push({ puzzleId, mistake: wrongStep });
    }
    stats.score = Math.max(0, stats.score - 5); // Penalty
  }
  return saveStats(stats);
};

export const recordQuizScore = (score: number) => {
  const stats = getStats();
  stats.score += score;
   if (score >= 50 && !stats.badges.includes(BadgeType.MASTER)) { // Assuming 5 questions * 10 pts
    stats.badges.push(BadgeType.MASTER);
  }
  return saveStats(stats);
};