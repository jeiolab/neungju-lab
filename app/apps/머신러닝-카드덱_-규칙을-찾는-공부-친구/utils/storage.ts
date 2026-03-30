import { UserState } from '../types';

const STORAGE_KEYS = {
  MASTERY: 'ml_deck_v1_mastery',
  CARD_STATUS: 'ml_deck_v1_cardStatus',
  QUIZ_HISTORY: 'ml_deck_v1_quizHistory',
  STREAK: 'ml_deck_v1_streak',
  LAST_LOGIN: 'ml_deck_v1_lastLogin',
  BADGES: 'ml_deck_v1_badges',
  THINK_ANSWERS: 'ml_deck_v1_thinkAnswers',
  CHECK_HISTORY: 'ml_deck_v1_checkHistory'
};

const DEFAULT_STATE: UserState = {
  mastery: {},
  cardStatus: {},
  checkQuestionHistory: {},
  quizHistory: [],
  streak: 0,
  lastLoginDate: '',
  badges: [],
  thinkAnswers: {}
};

export const loadState = (): UserState => {
  try {
    const loadedState = { ...DEFAULT_STATE };
    
    const mastery = localStorage.getItem(STORAGE_KEYS.MASTERY);
    if (mastery) loadedState.mastery = JSON.parse(mastery);

    const cardStatus = localStorage.getItem(STORAGE_KEYS.CARD_STATUS);
    if (cardStatus) loadedState.cardStatus = JSON.parse(cardStatus);

    const checkHistory = localStorage.getItem(STORAGE_KEYS.CHECK_HISTORY);
    if (checkHistory) loadedState.checkQuestionHistory = JSON.parse(checkHistory);

    const quizHistory = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    if (quizHistory) loadedState.quizHistory = JSON.parse(quizHistory);

    const streak = localStorage.getItem(STORAGE_KEYS.STREAK);
    if (streak) loadedState.streak = JSON.parse(streak);

    const lastLogin = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
    if (lastLogin) loadedState.lastLoginDate = lastLogin;

    const badges = localStorage.getItem(STORAGE_KEYS.BADGES);
    if (badges) loadedState.badges = JSON.parse(badges);

    const thinkAnswers = localStorage.getItem(STORAGE_KEYS.THINK_ANSWERS);
    if (thinkAnswers) loadedState.thinkAnswers = JSON.parse(thinkAnswers);

    return loadedState;
  } catch (e) {
    console.error("Failed to load state", e);
    return DEFAULT_STATE;
  }
};

export const saveState = (key: keyof typeof STORAGE_KEYS, value: any) => {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key}`, e);
  }
};

export const saveRawState = (key: keyof typeof STORAGE_KEYS, value: string) => {
    localStorage.setItem(STORAGE_KEYS[key], value);
}

export const checkStreak = (currentStreak: number, lastDate: string): { newStreak: number; today: string } => {
  const today = new Date().toLocaleDateString();
  if (lastDate === today) return { newStreak: currentStreak, today };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString();

  if (lastDate === yesterdayStr) {
    return { newStreak: currentStreak + 1, today };
  } else {
    return { newStreak: 1, today }; // Reset or start new
  }
};
