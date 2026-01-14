import { STORAGE_KEY, UserState, REFLECTIONS_KEY, ReflectionEntry } from './types';

export const getInitialUserState = (): UserState => ({
  xp: 0,
  level: 1,
  streak: 1,
  lastLogin: new Date().toDateString(),
  badges: [],
  quizHistory: {},
  wrongNotes: [],
  completedReflections: 0,
});

export const loadUserState = (): UserState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load user state", e);
  }
  return getInitialUserState();
};

export const saveUserState = (state: UserState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadReflections = (): ReflectionEntry[] => {
  try {
    const stored = localStorage.getItem(REFLECTIONS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load reflections", e);
  }
  return [];
}

export const saveReflection = (entry: ReflectionEntry) => {
  const current = loadReflections();
  const updated = [entry, ...current];
  localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(updated));
}

export const calculateLevel = (xp: number) => {
  // Simple formula: Level increases every 100-ish XP, handled by constants array ideally
  // Using a sqrt curve for dynamic feeling: Level = floor(sqrt(XP / 50)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

// Masking PII
export const maskPII = (text: string): string => {
  let masked = text;

  // Phone numbers (010-1234-5678, 01012345678)
  masked = masked.replace(/(01[016789])[-.\s]?(\d{3,4})[-.\s]?(\d{4})/g, '$1-****-$3');

  // RRN (Resident Registration Number) simplistic check (6 digits - 7 digits)
  masked = masked.replace(/(\d{6})[-.\s]?([1-4]\d{6})/g, '$1-*******');

  // Email
  masked = masked.replace(/([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g, (match, p1, p2) => {
    return p1.substring(0, 2) + '****@' + p2;
  });

  return masked;
};

export const hasPII = (text: string): boolean => {
    const phoneRegex = /(01[016789])[-.\s]?(\d{3,4})[-.\s]?(\d{4})/;
    const emailRegex = /([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/;
    const rrnRegex = /(\d{6})[-.\s]?([1-4]\d{6})/;
    return phoneRegex.test(text) || emailRegex.test(text) || rrnRegex.test(text);
}
