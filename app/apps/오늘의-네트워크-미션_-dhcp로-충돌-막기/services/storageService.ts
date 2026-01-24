import { AppState } from '../types';

const KEY_PREFIX = 'net_app6_';

export const storageService = {
  getSeed: (): string => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    localStorage.setItem(KEY_PREFIX + 'dailySeed', today);
    return today;
  },

  loadState: (): Partial<AppState> => {
    try {
      const streak = parseInt(localStorage.getItem(KEY_PREFIX + 'streak') || '0', 10);
      const mastery = parseInt(localStorage.getItem(KEY_PREFIX + 'mastery') || '0', 10);
      const wrongNotes = JSON.parse(localStorage.getItem(KEY_PREFIX + 'wrongNotes') || '[]');
      const dailyDone = JSON.parse(localStorage.getItem(KEY_PREFIX + 'dailyDone') || '{}');
      const lastVisit = localStorage.getItem(KEY_PREFIX + 'lastVisit') || new Date().toISOString();

      return { streak, mastery, wrongNotes, dailyDone, lastVisit };
    } catch (e) {
      console.error("Failed to load state", e);
      return {};
    }
  },

  saveState: (state: Partial<AppState>) => {
    if (state.streak !== undefined) localStorage.setItem(KEY_PREFIX + 'streak', state.streak.toString());
    if (state.mastery !== undefined) localStorage.setItem(KEY_PREFIX + 'mastery', state.mastery.toString());
    if (state.wrongNotes !== undefined) localStorage.setItem(KEY_PREFIX + 'wrongNotes', JSON.stringify(state.wrongNotes));
    if (state.dailyDone !== undefined) localStorage.setItem(KEY_PREFIX + 'dailyDone', JSON.stringify(state.dailyDone));
    if (state.lastVisit !== undefined) localStorage.setItem(KEY_PREFIX + 'lastVisit', state.lastVisit);
  },

  markDailyComplete: (date: string) => {
    const dailyDone = JSON.parse(localStorage.getItem(KEY_PREFIX + 'dailyDone') || '{}');
    if (!dailyDone[date]) {
      dailyDone[date] = true;
      localStorage.setItem(KEY_PREFIX + 'dailyDone', JSON.stringify(dailyDone));
      
      // Update streak
      const lastVisit = localStorage.getItem(KEY_PREFIX + 'lastVisit');
      let currentStreak = parseInt(localStorage.getItem(KEY_PREFIX + 'streak') || '0', 10);
      
      // Simple streak logic: if last visit was yesterday, increment. If today, do nothing. Else reset.
      // For this demo, we just increment if not already done today.
      currentStreak += 1; 
      localStorage.setItem(KEY_PREFIX + 'streak', currentStreak.toString());
      localStorage.setItem(KEY_PREFIX + 'lastVisit', new Date().toISOString());
      return currentStreak;
    }
    return parseInt(localStorage.getItem(KEY_PREFIX + 'streak') || '0', 10);
  }
};
