import { UserProgress, Mission } from './types';
import { STORAGE_KEYS, LEVELS } from './constants';

export const getInitialProgress = (): UserProgress => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    xp: 0,
    level: 1,
    badges: [],
    streak: 0,
    lastLoginDate: '',
    missionHistory: {},
    wrongNotes: [],
    quizMastery: 0,
  };
};

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
};

export const calculateLevel = (xp: number): number => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i]) return i + 1;
  }
  return 1;
};

export const getRandomMissions = (allMissions: Mission[], count: number): Mission[] => {
  const shuffled = [...allMissions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const updateStreak = (progress: UserProgress): UserProgress => {
  const today = new Date().toDateString();
  const last = progress.lastLoginDate;

  if (last === today) return progress;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  let newStreak = 1;
  if (last === yesterday.toDateString()) {
    newStreak = progress.streak + 1;
  }

  return {
    ...progress,
    streak: newStreak,
    lastLoginDate: today
  };
};

export const getDailyMission = (missions: Mission[]): Mission => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % missions.length;
  return missions[index];
};
