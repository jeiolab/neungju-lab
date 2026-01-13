import { UserState, WrongNote } from '../types';
import { LOCAL_STORAGE_KEY_PREFIX } from '../constants';

export const loadState = (): UserState => {
  const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}state`);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    points: 0,
    level: 1,
    streak: 0,
    lastLoginDate: '',
    masteryByConcept: {
      sequence: 0,
      selection: 0,
      iteration: 0,
      indentation: 0,
      logic: 0,
      nested: 0
    },
    badges: []
  };
};

export const saveState = (state: UserState) => {
  localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}state`, JSON.stringify(state));
};

export const loadWrongNotes = (): WrongNote[] => {
  const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}wrongNotes`);
  return saved ? JSON.parse(saved) : [];
};

export const saveWrongNotes = (notes: WrongNote[]) => {
  localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}wrongNotes`, JSON.stringify(notes));
};
