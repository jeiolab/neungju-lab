import { UserProfile, ProjectSpec, QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../constants';

const PROFILE_KEY = 'iot_app4_profile';
const SPECS_KEY = 'iot_app4_specs';

export const getProfile = (): UserProfile => {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    level: 1,
    xp: 0,
    badges: [],
    quizHistory: {},
    completedSpecs: 0,
  };
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getSpecs = (): ProjectSpec[] => {
  const stored = localStorage.getItem(SPECS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveSpec = (spec: ProjectSpec) => {
  const specs = getSpecs();
  specs.push(spec);
  localStorage.setItem(SPECS_KEY, JSON.stringify(specs));
};

export const updateXP = (amount: number) => {
  const profile = getProfile();
  profile.xp += amount;
  // Simple level up logic: Level = 1 + floor(xp / 100)
  const newLevel = 1 + Math.floor(profile.xp / 100);
  if (newLevel > profile.level) {
    profile.level = newLevel;
  }
  saveProfile(profile);
  return profile;
};

export const awardBadge = (badgeName: string) => {
  const profile = getProfile();
  if (!profile.badges.includes(badgeName)) {
    profile.badges.push(badgeName);
    saveProfile(profile);
    return true; // New badge awarded
  }
  return false;
};
