import { UserProgress, ConceptMastery, WrongNote, Badge } from '../types';
import { INITIAL_BADGES } from '../constants';

const KEYS = {
  PROGRESS: 'iot_app1_progress',
  MASTERY: 'iot_app1_mastery',
  WRONG_NOTES: 'iot_app1_wrongNotes',
};

export const getProgress = (): UserProgress => {
  const stored = localStorage.getItem(KEYS.PROGRESS);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    level: 1,
    xp: 0,
    badges: INITIAL_BADGES,
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
  };
};

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
};

export const updateStreak = (progress: UserProgress): UserProgress => {
  const today = new Date().toISOString().split('T')[0];
  if (progress.lastActiveDate === today) return progress;

  const lastDate = new Date(progress.lastActiveDate);
  const curDate = new Date(today);
  const diffTime = Math.abs(curDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let newStreak = progress.streak;
  if (diffDays === 1) {
    newStreak += 1;
  } else if (diffDays > 1) {
    newStreak = 1; // Reset if missed a day
  }

  return { ...progress, streak: newStreak, lastActiveDate: today };
};

export const getMastery = (): ConceptMastery => {
  const stored = localStorage.getItem(KEYS.MASTERY);
  return stored ? JSON.parse(stored) : {};
};

export const saveMastery = (mastery: ConceptMastery) => {
  localStorage.setItem(KEYS.MASTERY, JSON.stringify(mastery));
};

export const getWrongNotes = (): WrongNote[] => {
  const stored = localStorage.getItem(KEYS.WRONG_NOTES);
  return stored ? JSON.parse(stored) : [];
};

export const addWrongNote = (note: WrongNote) => {
  const notes = getWrongNotes();
  notes.push(note);
  localStorage.setItem(KEYS.WRONG_NOTES, JSON.stringify(notes));
};