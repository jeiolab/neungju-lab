import { UserState } from '../types';

const STORAGE_KEY = 'sort_algo_coach_state';

const defaultState: UserState = {
  level: 1,
  xp: 0,
  badges: [],
  scenariosCompleted: [],
  streak: 0,
};

export const loadUserState = (): UserState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return defaultState;
    return JSON.parse(serialized);
  } catch (e) {
    console.error("Failed to load state", e);
    return defaultState;
  }
};

export const saveUserState = (state: UserState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

export const awardXP = (amount: number, currentState: UserState): UserState => {
  const newState = { ...currentState, xp: currentState.xp + amount };
  // Simple level up logic: Level * 100 XP required
  const xpNeeded = newState.level * 100;
  if (newState.xp >= xpNeeded) {
    newState.level += 1;
    newState.xp -= xpNeeded;
  }
  saveUserState(newState);
  return newState;
};

export const awardBadge = (badgeName: string, currentState: UserState): UserState => {
  if (currentState.badges.includes(badgeName)) return currentState;
  const newState = { ...currentState, badges: [...currentState.badges, badgeName] };
  saveUserState(newState);
  return newState;
};
