import { UserProgress, QuizHistoryItem } from '../types';

const STORAGE_KEY = 'selection_sort_mastery_data';

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streak: 1,
  lastLoginDate: new Date().toDateString(),
  badges: [],
  conceptMastery: {},
  completedQuizzes: [],
  quizHistory: [],
};

export const getProgress = (): UserProgress => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_PROGRESS;
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load progress", e);
    return DEFAULT_PROGRESS;
  }
};

export const saveProgress = (progress: UserProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress", e);
  }
};

export const updateXP = (amount: number): { newLevel: number, leveledUp: boolean } => {
  const current = getProgress();
  const oldLevel = current.level;
  
  // Simple Level Logic: Level = 1 + floor(xp / 200) for demo
  // Or use thresholds from constants if imported.
  // Using simple linear for safety in closed env.
  current.xp += amount;
  current.level = Math.floor(current.xp / 100) + 1;
  
  // Streak Logic
  const today = new Date().toDateString();
  if (current.lastLoginDate !== today) {
    // Check if consecutive
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (current.lastLoginDate === yesterday.toDateString()) {
      current.streak += 1;
    } else {
      current.streak = 1; // Reset if missed a day
    }
    current.lastLoginDate = today;
  }

  saveProgress(current);
  return { newLevel: current.level, leveledUp: current.level > oldLevel };
};

export const addBadge = (badgeName: string) => {
  const current = getProgress();
  if (!current.badges.includes(badgeName)) {
    current.badges.push(badgeName);
    saveProgress(current);
    return true; // New badge added
  }
  return false;
};

export const updateMastery = (cardId: string, delta: number) => {
  const current = getProgress();
  const oldVal = current.conceptMastery[cardId] || 0;
  let newVal = oldVal + delta;
  if (newVal > 100) newVal = 100;
  if (newVal < 0) newVal = 0;
  
  current.conceptMastery[cardId] = newVal;
  saveProgress(current);
  return newVal;
};

export const recordQuizResult = (item: QuizHistoryItem) => {
  const current = getProgress();
  current.quizHistory.push(item);
  saveProgress(current);
};
