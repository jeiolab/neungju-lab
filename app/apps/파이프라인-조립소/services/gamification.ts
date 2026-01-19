import { UserStats, PuzzleDifficulty } from '../types';

const STORAGE_KEY = 'pipeline_puzzle_stats';

const DEFAULT_STATS: UserStats = {
  puzzleStreak: 0,
  lastPlayedDate: null,
  badges: [],
  quizScore: 0,
  puzzleCompletes: {
    [PuzzleDifficulty.EASY]: 0,
    [PuzzleDifficulty.MEDIUM]: 0,
    [PuzzleDifficulty.HARD]: 0,
  }
};

export const getStats = (): UserStats => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_STATS;
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const updateStreak = () => {
  const stats = getStats();
  const today = new Date().toDateString();

  if (stats.lastPlayedDate !== today) {
    // Check if it was yesterday for streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (stats.lastPlayedDate === yesterday.toDateString()) {
      stats.puzzleStreak += 1;
    } else {
      stats.puzzleStreak = 1; // Reset or Start
    }
    stats.lastPlayedDate = today;
    saveStats(stats);
  }
  return stats;
};

export const completePuzzle = (difficulty: PuzzleDifficulty) => {
  const stats = updateStreak(); // Also updates daily play
  stats.puzzleCompletes[difficulty] += 1;
  
  // Badge Logic
  if (stats.puzzleCompletes[PuzzleDifficulty.HARD] >= 3 && !stats.badges.includes('파이프라인 장인')) {
    stats.badges.push('파이프라인 장인');
  }
  if ((stats.puzzleCompletes[PuzzleDifficulty.EASY] + stats.puzzleCompletes[PuzzleDifficulty.MEDIUM] + stats.puzzleCompletes[PuzzleDifficulty.HARD]) >= 10 && !stats.badges.includes('성실한 조립공')) {
     stats.badges.push('성실한 조립공');
  }

  saveStats(stats);
  return stats;
};

export const updateQuizScore = (score: number) => {
  const stats = getStats();
  // Keep highest score
  if (score > stats.quizScore) {
    stats.quizScore = score;
    if (score === 100 && !stats.badges.includes('이론 마스터')) {
      stats.badges.push('이론 마스터');
    }
    saveStats(stats);
  }
  return stats;
};
