import { UserProgress } from '../types';

const STORAGE_KEY = 'sns-defense-lab-v1';
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const INITIAL_STATE: UserProgress = {
  streak: 0,
  lastLoginDate: '',
  defenseScore: 0,
  badges: [],
  solvedQuizzes: [],
  vulnerableConcepts: [],
  simBestScore: 100, // 100 is worst, 0 is best
  completedMissions: [],
  classRules: ''
};

export const loadProgress = (): UserProgress => {
  if (!isBrowser) return INITIAL_STATE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return INITIAL_STATE;
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load progress", e);
    return INITIAL_STATE;
  }
};

export const saveProgress = (progress: UserProgress) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress", e);
  }
};

export const updateStreak = (progress: UserProgress): UserProgress => {
  const today = new Date().toDateString();
  if (progress.lastLoginDate === today) return progress;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (progress.lastLoginDate === yesterday.toDateString()) {
    progress.streak += 1;
  } else {
    progress.streak = 1;
  }
  progress.lastLoginDate = today;
  saveProgress(progress);
  return progress;
};