import { CharterData, UserProgress } from '../types';

const CHARTER_KEY = 'class_charter_v1';
const PROGRESS_KEY = 'class_charter_progress';

export const saveCharter = (data: CharterData) => {
  // Get existing history first
  const currentProgress = loadProgress();
  const newHistoryItem = { timestamp: Date.now(), data: { ...data } };
  
  // Keep only last 5
  const updatedHistory = [newHistoryItem, ...currentProgress.history].slice(0, 5);
  
  // Update progress
  const updatedProgress: UserProgress = {
    ...currentProgress,
    history: updatedHistory,
    lastVisit: Date.now(),
  };

  localStorage.setItem(CHARTER_KEY, JSON.stringify(data));
  saveProgress(updatedProgress);
};

export const loadCharter = (): CharterData | null => {
  const stored = localStorage.getItem(CHARTER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const loadProgress = (): UserProgress => {
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    badges: [],
    quizScore: 0,
    streak: 0,
    lastVisit: Date.now(),
    history: [],
    quizMistakes: []
  };
};

export const updateStreak = () => {
  const progress = loadProgress();
  const now = new Date();
  const last = new Date(progress.lastVisit);
  
  // Simple day check
  const isSameDay = now.getDate() === last.getDate() && 
                    now.getMonth() === last.getMonth() && 
                    now.getFullYear() === last.getFullYear();
  
  if (!isSameDay) {
    // If it's been less than 48 hours, increment. Else reset.
    const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
    if (diffHours < 48) {
      progress.streak += 1;
    } else {
      progress.streak = 1;
    }
  }
  
  progress.lastVisit = now.getTime();
  saveProgress(progress);
};