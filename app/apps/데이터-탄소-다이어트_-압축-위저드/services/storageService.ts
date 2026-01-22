import { STORAGE_KEYS, ProjectDraft, UserState } from '../types';
import { BADGE_LIST, CHECKLIST_ITEMS } from '../constants';

export const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error loading ${key}`, e);
    return defaultValue;
  }
};

export const setStoredData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key}`, e);
  }
};

export const saveProject = (project: ProjectDraft) => {
  const projects = getStoredData<ProjectDraft[]>(STORAGE_KEYS.PROJECT_DRAFTS, []);
  projects.push(project);
  setStoredData(STORAGE_KEYS.PROJECT_DRAFTS, projects);
  checkBadges();
};

export const updateChecklist = (index: number, checked: boolean) => {
  const list = getStoredData<boolean[]>(STORAGE_KEYS.CHECKLIST, new Array(CHECKLIST_ITEMS.length).fill(false));
  list[index] = checked;
  setStoredData(STORAGE_KEYS.CHECKLIST, list);
  checkBadges();
  return list;
};

export const updateStreak = () => {
  const lastLogin = getStoredData<string>(STORAGE_KEYS.LAST_LOGIN, '');
  const today = new Date().toDateString();
  let streak = getStoredData<number>(STORAGE_KEYS.STREAK, 0);

  if (lastLogin !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastLogin === yesterday.toDateString()) {
      streak += 1;
    } else {
      streak = 1; 
    }
    setStoredData(STORAGE_KEYS.LAST_LOGIN, today);
    setStoredData(STORAGE_KEYS.STREAK, streak);
  }
  return streak;
};

const checkBadges = () => {
  const currentBadges = getStoredData<string[]>(STORAGE_KEYS.BADGES, []);
  const newBadges = [...currentBadges];
  
  // 1. Data Dieter Badge
  const checklist = getStoredData<boolean[]>(STORAGE_KEYS.CHECKLIST, []);
  const checkedCount = checklist.filter(Boolean).length;
  if (checkedCount / CHECKLIST_ITEMS.length >= 0.8 && !newBadges.includes('diet_master')) {
    newBadges.push('diet_master');
  }

  // 2. Project Builder Badge
  const projects = getStoredData<ProjectDraft[]>(STORAGE_KEYS.PROJECT_DRAFTS, []);
  if (projects.length >= 1 && !newBadges.includes('project_builder')) {
    newBadges.push('project_builder');
  }

  // 3. Ethical Thinker (Quiz Mastery)
  const mastery = getStoredData<Record<number, boolean>>(STORAGE_KEYS.MASTERY, {});
  // Assuming 10 questions total
  const masteryCount = Object.values(mastery).filter(Boolean).length;
  if (masteryCount >= 10 && !newBadges.includes('ethical_thinker')) {
    newBadges.push('ethical_thinker');
  }

  if (newBadges.length !== currentBadges.length) {
    setStoredData(STORAGE_KEYS.BADGES, newBadges);
    // Could dispatch an event here if needed, but simple reload on component mount works for now
  }
};