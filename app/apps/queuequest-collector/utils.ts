import { UserProfile, QuizQuestion, Difficulty } from './types';

export const getInitialProfile = (): UserProfile => {
  const stored = localStorage.getItem('queuequest_profile');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    level: 1,
    xp: 0,
    badges: [],
    streak: 0,
    lastLogin: new Date().toISOString(),
    mastery: {},
  };
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem('queuequest_profile', JSON.stringify(profile));
};

export const calculateXP = (profile: UserProfile, amount: number): UserProfile => {
  let newXp = profile.xp + amount;
  let newLevel = profile.level;
  
  // Simple leveling: Level * 100 XP needed for next level
  const xpNeeded = newLevel * 100;
  if (newXp >= xpNeeded) {
    newLevel++;
    newXp -= xpNeeded;
  }

  return { ...profile, xp: newXp, level: newLevel };
};

export const checkAnswers = (question: QuizQuestion, answer: string | number): boolean => {
  if (question.type === 'multiple') {
    return question.correctAnswer === answer;
  }
  
  if (question.type === 'short') {
    const correctList = question.correctAnswer as string[];
    return correctList.some(ans => ans.trim().toLowerCase() === String(answer).trim().toLowerCase());
  }

  if (question.type === 'descriptive') {
    // Basic keyword check logic
    const keywords = question.correctAnswer as string[];
    const userText = String(answer).toLowerCase();
    const matchCount = keywords.filter(k => userText.includes(k)).length;
    return matchCount >= 1; // Require at least 1 keyword match for "Coach" leniency
  }

  return false;
};

export const getFilteredQuestions = (allQuestions: QuizQuestion[], difficulty: Difficulty, count: number = 5): QuizQuestion[] => {
    // In a real app, this would random sample. Here we just take the first N matching.
    const filtered = allQuestions.filter(q => q.difficulty === difficulty);
    // If not enough questions of that difficulty, fill with others
    if (filtered.length < count) {
        const others = allQuestions.filter(q => q.difficulty !== difficulty);
        return [...filtered, ...others].slice(0, count);
    }
    return filtered.slice(0, count);
};