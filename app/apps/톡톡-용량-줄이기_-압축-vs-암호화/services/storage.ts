import { UserState } from "../types";

const STORAGE_KEY = 'app1_progress';

const INITIAL_STATE: UserState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastLoginDate: '',
  badges: [],
  completedConcepts: [],
  mastery: {
    compression: 0,
    lossless: 0,
    lossy: 0,
    rle: 0,
    encryption: 0,
    huffman: 0,
  },
  wrongNotes: [],
  reflections: {},
};

export const loadState = (): UserState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return INITIAL_STATE;
    return { ...INITIAL_STATE, ...JSON.parse(stored) };
  } catch (e) {
    console.error("Failed to load state", e);
    return INITIAL_STATE;
  }
};

export const saveState = (state: UserState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

export const calculateLevel = (xp: number) => {
  return Math.floor(xp / 100) + 1;
};

export const updateStreak = (state: UserState): UserState => {
  const today = new Date().toISOString().split('T')[0];
  if (state.lastLoginDate === today) return state;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = state.streak;
  if (state.lastLoginDate === yesterdayStr) {
    newStreak += 1;
  } else {
    newStreak = 1;
  }

  return {
    ...state,
    streak: newStreak,
    lastLoginDate: today,
  };
};