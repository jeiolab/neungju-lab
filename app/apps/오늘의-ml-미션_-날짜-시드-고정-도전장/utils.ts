import { DailyTheme, MLType } from './types';
import { THEME_ROTATION } from './constants';

// Simple hash function to generate a seed from a string
export const generateSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const getDailyDateStr = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getThemeForDate = (dateStr: string): DailyTheme => {
  const seed = generateSeed(dateStr);
  const index = seed % THEME_ROTATION.length;
  return THEME_ROTATION[index];
};

export const calculateStreak = (lastDate: string | null, frozenAvailable: boolean): { streak: number, isFrozenUsed: boolean } => {
  if (!lastDate) return { streak: 0, isFrozenUsed: false };

  const today = new Date(getDailyDateStr());
  const last = new Date(lastDate);
  
  const diffTime = Math.abs(today.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { streak: -1, isFrozenUsed: false }; // Already done today (flag)
  if (diffDays === 1) return { streak: 0, isFrozenUsed: false }; // Continue (caller handles increment)
  
  // Missed a day
  if (diffDays === 2 && frozenAvailable) {
    return { streak: 0, isFrozenUsed: true }; // Frozen used, streak maintained
  }

  return { streak: -999, isFrozenUsed: false }; // Reset
};
