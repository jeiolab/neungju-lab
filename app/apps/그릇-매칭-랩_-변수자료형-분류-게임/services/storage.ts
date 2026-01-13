import { UserStats, INITIAL_STATS, SavedThinkAnswer, WrongNote } from '../types';

const STORAGE_KEY_PROGRESS = 'bowlLab_progress';
const STORAGE_KEY_THINK = 'bowlLab_thinkAnswers';

export const loadStats = (): UserStats => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!data) return INITIAL_STATS;
    const parsed = JSON.parse(data);
    return { ...INITIAL_STATS, ...parsed }; // Merge to ensure new fields are present
  } catch (e) {
    return INITIAL_STATS;
  }
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(stats));
};

export const loadThinkAnswers = (): SavedThinkAnswer[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_THINK);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveThinkAnswer = (answer: SavedThinkAnswer) => {
  const current = loadThinkAnswers();
  const index = current.findIndex(a => a.questionId === answer.questionId);
  if (index >= 0) {
    current[index] = answer;
  } else {
    current.push(answer);
  }
  localStorage.setItem(STORAGE_KEY_THINK, JSON.stringify(current));
};

export const checkStreak = (stats: UserStats): UserStats => {
  const today = new Date().toISOString().split('T')[0];
  const last = stats.lastStudyDate ? stats.lastStudyDate.split('T')[0] : null;

  if (last === today) return stats;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = stats.streak;
  if (last === yesterdayStr) {
    newStreak += 1;
  } else {
    newStreak = 1; // Reset or start
  }

  return { ...stats, streak: newStreak, lastStudyDate: new Date().toISOString() };
};