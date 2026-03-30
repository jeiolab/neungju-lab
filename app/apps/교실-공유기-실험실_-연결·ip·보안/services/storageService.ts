import { UserProgress } from '../types';

const STORAGE_KEY = 'router_lab_v1';

const DEFAULT_PROGRESS: UserProgress = {
  highScore: 0,
  streak: 0,
  lastLoginDate: new Date().toISOString().split('T')[0],
  badges: [],
  historySummary: [],
};

export const loadProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(stored);
    
    // Streak logic check
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastLoginDate !== today) {
        // If last login was yesterday, streak continues. If older, streak resets.
        const lastDate = new Date(parsed.lastLoginDate);
        const currDate = new Date(today);
        const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays > 1) {
            parsed.streak = 0; // Reset streak if missed a day
        }
        // If diffDays == 1, streak is maintained.
        // If diffDays == 0, already logged in today, do nothing.
    }
    
    return { ...DEFAULT_PROGRESS, ...parsed }; // Merge to ensure new fields exist
  } catch (e) {
    console.error("Storage load failed", e);
    return DEFAULT_PROGRESS;
  }
};

export const saveProgress = (progress: UserProgress) => {
  try {
    const toSave = {
        ...progress,
        lastLoginDate: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error("Storage save failed", e);
  }
};

export const updateStreak = (current: UserProgress): UserProgress => {
    const today = new Date().toISOString().split('T')[0];
    if (current.lastLoginDate !== today) {
        return {
            ...current,
            streak: current.streak + 1,
            lastLoginDate: today
        };
    }
    return current;
}