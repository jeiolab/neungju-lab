import { UserState, NetworkItem } from '../types';

const KEY = 'net_mastery_app_v1';

const INITIAL_STATE: UserState = {
  mastery: {},
  totalScore: 0,
  level: 1,
  streak: 1,
  lastLoginDate: new Date().toDateString(),
  badges: [],
  wrongNotes: [],
  layout: [],
  simulationHistory: []
};

export const loadState = (): UserState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    
    // Streak logic check
    const today = new Date().toDateString();
    if (parsed.lastLoginDate !== today) {
      const last = new Date(parsed.lastLoginDate);
      const diff = (new Date().getTime() - last.getTime()) / (1000 * 3600 * 24);
      if (diff < 2 && diff >= 1) {
        parsed.streak += 1;
      } else if (diff >= 2) {
        parsed.streak = 1;
      }
      parsed.lastLoginDate = today;
      saveState(parsed);
    }
    
    return { ...INITIAL_STATE, ...parsed };
  } catch (e) {
    console.error("Failed to load state", e);
    return INITIAL_STATE;
  }
};

export const saveState = (state: UserState) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

export const updateMastery = (
  currentState: UserState,
  conceptId: string,
  delta: number
): UserState => {
  const currentScore = currentState.mastery[conceptId] || 0;
  let newScore = currentScore + delta;
  if (newScore > 100) newScore = 100;
  if (newScore < 0) newScore = 0;

  const newState = {
    ...currentState,
    mastery: { ...currentState.mastery, [conceptId]: newScore },
    totalScore: currentState.totalScore + (delta > 0 ? delta : 0) // Only add positive score to total
  };
  
  // Level up logic (Simple: every 100 points = 1 level)
  const newLevel = Math.floor(newState.totalScore / 100) + 1;
  newState.level = newLevel;

  saveState(newState);
  return newState;
};
