import { TuningRecord, Badge, ReflectionEntry } from '../types';

const KEYS = {
  TUNINGS: 'iot_app5_tunings',
  BADGES: 'iot_app5_badges',
  STREAK: 'iot_app5_streak',
  REFLECTIONS: 'iot_app5_reflections',
  QUIZ_SCORE: 'iot_app5_quiz_score'
};

export const saveTuning = (record: TuningRecord) => {
  const current = getTunings();
  const updated = [record, ...current].slice(0, 50); // Keep last 50
  localStorage.setItem(KEYS.TUNINGS, JSON.stringify(updated));
};

export const getTunings = (): TuningRecord[] => {
  const data = localStorage.getItem(KEYS.TUNINGS);
  return data ? JSON.parse(data) : [];
};

export const saveBadges = (badges: Badge[]) => {
  localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
};

export const getBadges = (): Badge[] | null => {
  const data = localStorage.getItem(KEYS.BADGES);
  return data ? JSON.parse(data) : null;
};

export const updateStreak = () => {
  const today = new Date().toDateString();
  const lastStreak = localStorage.getItem(KEYS.STREAK);
  
  if (lastStreak !== today) {
    localStorage.setItem(KEYS.STREAK, today);
    return true; // Streak updated
  }
  return false; // Already updated today
};

export const saveReflection = (entry: ReflectionEntry) => {
  const current = getReflections();
  const updated = [entry, ...current];
  localStorage.setItem(KEYS.REFLECTIONS, JSON.stringify(updated));
};

export const getReflections = (): ReflectionEntry[] => {
  const data = localStorage.getItem(KEYS.REFLECTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveQuizScore = (score: number) => {
    localStorage.setItem(KEYS.QUIZ_SCORE, score.toString());
}

export const getQuizScore = (): number => {
    return parseInt(localStorage.getItem(KEYS.QUIZ_SCORE) || '0', 10);
}