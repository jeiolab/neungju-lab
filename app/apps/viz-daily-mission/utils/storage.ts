import { UserEntry, UserProfile } from "../types";

const KEY_PROFILE = 'vizdaily_profile';
const KEY_ENTRIES = 'vizdaily_entries';

export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

export const loadProfile = (): UserProfile => {
  const stored = localStorage.getItem(KEY_PROFILE);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    streak: 0,
    lastCompletedDate: null,
    totalCompleted: 0,
    badges: []
  };
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(KEY_PROFILE, JSON.stringify(profile));
};

export const loadEntries = (): UserEntry[] => {
  const stored = localStorage.getItem(KEY_ENTRIES);
  return stored ? JSON.parse(stored) : [];
};

export const saveEntry = (entry: UserEntry) => {
  const entries = loadEntries();
  // Filter out existing entry for today if any (overwrite logic or prevent duplicate)
  // Here we allow overwriting for UX simplicity in this demo, or append.
  // Prompt says "Daily Mission", implying one per day.
  const newEntries = entries.filter(e => e.date !== entry.date);
  newEntries.push(entry);
  localStorage.setItem(KEY_ENTRIES, JSON.stringify(newEntries));
};

export const updateStreakAndBadges = (currentProfile: UserProfile, score: number): UserProfile => {
  const today = getTodayDateString();
  
  if (currentProfile.lastCompletedDate === today) {
    return currentProfile; // Already done today
  }

  let newStreak = currentProfile.streak;
  
  // Check if yesterday was completed
  if (currentProfile.lastCompletedDate) {
    const last = new Date(
      parseInt(currentProfile.lastCompletedDate.substring(0, 4)),
      parseInt(currentProfile.lastCompletedDate.substring(4, 6)) - 1,
      parseInt(currentProfile.lastCompletedDate.substring(6, 8))
    );
    const now = new Date();
    // Reset time for comparison
    last.setHours(0,0,0,0);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0,0,0,0);

    if (last.getTime() === yesterday.getTime()) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  const newBadges = [...currentProfile.badges];
  if (newStreak >= 7 && !newBadges.includes("7일 연속")) newBadges.push("7일 연속");
  if (score >= 90 && !newBadges.includes("해석왕")) newBadges.push("해석왕");

  return {
    ...currentProfile,
    streak: newStreak,
    totalCompleted: currentProfile.totalCompleted + 1,
    lastCompletedDate: today,
    badges: newBadges
  };
};