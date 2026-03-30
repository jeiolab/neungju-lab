import { UserProgress, ReflectionEntry } from '../types';

const KEYS = {
  PROGRESS: 'app3_puzzleProgress',
  REFLECTIONS: 'app3_reflections',
};

const INITIAL_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  badges: [],
  solvedPuzzles: 0,
  streak: 1,
  lastLoginDate: new Date().toISOString().split('T')[0],
};

export const loadProgress = (): UserProgress => {
  const stored = localStorage.getItem(KEYS.PROGRESS);
  if (!stored) return INITIAL_PROGRESS;
  
  const parsed = JSON.parse(stored);
  // Simple streak logic check
  const today = new Date().toISOString().split('T')[0];
  if (parsed.lastLoginDate !== today) {
    const lastDate = new Date(parsed.lastLoginDate);
    const currDate = new Date(today);
    const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays === 1) {
      parsed.streak += 1;
    } else if (diffDays > 1) {
      parsed.streak = 1;
    }
    parsed.lastLoginDate = today;
    saveProgress(parsed);
  }
  return parsed;
};

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
};

export const loadReflections = (): ReflectionEntry[] => {
  const stored = localStorage.getItem(KEYS.REFLECTIONS);
  return stored ? JSON.parse(stored) : [];
};

export const saveReflections = (entries: ReflectionEntry[]) => {
  localStorage.setItem(KEYS.REFLECTIONS, JSON.stringify(entries));
};