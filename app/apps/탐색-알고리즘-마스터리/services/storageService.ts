import { UserState, ConceptId } from '../types';

const STORAGE_KEY = 'search_algo_mastery_v1';

const INITIAL_STATE: UserState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastLoginDate: new Date().toISOString().split('T')[0],
  mastery: {
    linear_def: 0,
    binary_def: 0,
    comparison: 0,
    prerequisites: 0,
  },
  badges: [],
  quizHistory: [],
  wrongNotes: [],
};

export const getStoredState = (): UserState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_STATE;
  try {
    const parsed = JSON.parse(stored);
    // Simple logic to check daily streak
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastLoginDate !== today) {
        // Logic to increment streak or reset would go here in a full backend,
        // for local storage we just update the login date on load if needed
        // but let's keep it simple for now.
    }
    return { ...INITIAL_STATE, ...parsed };
  } catch (e) {
    return INITIAL_STATE;
  }
};

export const saveState = (state: UserState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const calculateLevel = (xp: number) => {
  return Math.floor(xp / 100) + 1;
};

export const updateMastery = (
  currentMastery: Record<ConceptId, number>,
  conceptId: ConceptId,
  isCorrect: boolean,
  difficulty: 'easy' | 'medium' | 'hard'
): Record<ConceptId, number> => {
  const current = currentMastery[conceptId] || 0;
  let delta = 0;
  
  if (isCorrect) {
    if (difficulty === 'easy') delta = 6;
    else if (difficulty === 'medium') delta = 8;
    else delta = 10;
  } else {
    delta = -4;
  }

  const newValue = Math.min(100, Math.max(0, current + delta));
  return { ...currentMastery, [conceptId]: newValue };
};
