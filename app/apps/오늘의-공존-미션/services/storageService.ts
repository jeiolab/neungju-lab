import { UserState } from '../types';
import { formatDate } from '../utils';

const STORAGE_KEY = 'coexist_daily_v1';

const INITIAL_STATE: UserState = {
  streak: 0,
  lastCompletedDate: null,
  totalPoints: 0,
  badges: [],
  safetyRules: ['', '', '', '', ''],
  completedMissions: [],
  quizHistory: []
};

export const getStorage = (): UserState => {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : INITIAL_STATE;
  } catch (e) {
    console.error("Storage load error", e);
    return INITIAL_STATE;
  }
};

export const saveStorage = (state: UserState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Storage save error", e);
  }
};

export const updateStreak = (currentState: UserState): UserState => {
  const today = formatDate(new Date());
  
  if (currentState.lastCompletedDate === today) {
    return currentState;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  let newStreak = 1;
  if (currentState.lastCompletedDate === yesterdayStr) {
    newStreak = currentState.streak + 1;
  }

  let newBadges = [...currentState.badges];
  if (newStreak >= 7 && !newBadges.includes('7일 연속 공존 미션')) {
    newBadges.push('7일 연속 공존 미션');
  }

  return {
    ...currentState,
    streak: newStreak,
    lastCompletedDate: today,
    badges: newBadges,
    totalPoints: currentState.totalPoints + 100 // Daily clear bonus
  };
};