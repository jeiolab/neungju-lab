import { UserProgress, UserProject } from '../types';

const PROGRESS_KEY = 'insertion_sort_wizard_progress';
const PROJECT_KEY = 'insertion_sort_wizard_project';

export const getProgress = (): UserProgress => {
  const saved = localStorage.getItem(PROGRESS_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    score: 0,
    streak: 0,
    lastVisit: new Date().toISOString(),
    badges: [],
    completedWizard: false,
    quizScore: 0
  };
};

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const getProject = (): UserProject => {
  const saved = localStorage.getItem(PROJECT_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    problemDefinition: '',
    criteria: { primary: 'bpm', primaryOrder: 'asc' },
    explanation: '',
    reflection: ''
  };
};

export const saveProject = (project: UserProject) => {
  localStorage.setItem(PROJECT_KEY, JSON.stringify(project));
};

export const checkDailyStreak = (currentProgress: UserProgress): number => {
  const last = new Date(currentProgress.lastVisit);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  let newStreak = currentProgress.streak;
  if (diffDays === 1) {
    newStreak += 1;
  } else if (diffDays > 1) {
    newStreak = 1; // Reset if missed a day
  }
  
  return newStreak;
};