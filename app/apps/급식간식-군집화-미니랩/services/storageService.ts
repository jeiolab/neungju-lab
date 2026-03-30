import { UserProgress } from '../types';

const STORAGE_KEY = 'unsup_lab_v1';

const INITIAL_STATE: UserProgress = {
  score: 0,
  badges: [],
  streak: 0,
  lastVisitDate: '',
  mastery: { concepts: 0, simulation: 0, quiz: 0 },
  completedConcepts: [],
  solvedQuizzes: [],
  incorrectQuizzes: [],
  dailyMissionCompleted: false,
  reflections: { condition: '', counterExample: '', application: '', deepDive: '' },
};

export const loadProgress = (): UserProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_STATE;
    return { ...INITIAL_STATE, ...JSON.parse(saved) };
  } catch (e) {
    console.error('Failed to load progress', e);
    return INITIAL_STATE;
  }
};

export const saveProgress = (progress: UserProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
};

export const updateStreak = (current: UserProgress): UserProgress => {
  const today = new Date().toISOString().slice(0, 10);
  if (current.lastVisitDate === today) return current;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let newStreak = current.streak;

  if (current.lastVisitDate === yesterday) {
    newStreak += 1;
  } else {
    newStreak = 1; // Reset or Start
  }

  return {
    ...current,
    streak: newStreak,
    lastVisitDate: today,
    dailyMissionCompleted: false, // Reset daily mission on new day
  };
};