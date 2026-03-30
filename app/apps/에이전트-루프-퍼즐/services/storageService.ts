import { UserProgress } from '../types';

const KEY = 'agentloop_puzzle_v1';

const INITIAL_STATE: UserProgress = {
  xp: 0,
  streak: 0,
  lastLogin: new Date().toISOString().split('T')[0],
  badges: [],
  solvedPuzzleCount: 0,
  wrongConcepts: {},
  myAgentCards: []
};

export const loadProgress = (): UserProgress => {
  const stored = localStorage.getItem(KEY);
  if (!stored) return INITIAL_STATE;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_STATE;
  }
};

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(KEY, JSON.stringify(progress));
};

export const updateStreak = (current: UserProgress): UserProgress => {
  const today = new Date().toISOString().split('T')[0];
  const lastLogin = current.lastLogin;

  if (today === lastLogin) return current;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak = current.streak;

  if (lastLogin === yesterday) {
    newStreak += 1;
  } else {
    newStreak = 1;
  }

  return { ...current, streak: newStreak, lastLogin: today };
};
