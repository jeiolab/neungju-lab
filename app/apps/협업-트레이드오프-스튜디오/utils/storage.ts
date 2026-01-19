import { SimulationResult, UserStats } from '../types';

const KEYS = {
  RUNS: 'tradeoff_runs_v1',
  QUIZ: 'tradeoff_quiz_v1',
  WRONG: 'tradeoff_wrongnote_v1',
  STATS: 'tradeoff_stats_v1',
};

export const saveSimulation = (result: SimulationResult) => {
  const existing = getSimulations();
  const updated = [result, ...existing].slice(0, 50); // Keep last 50
  localStorage.setItem(KEYS.RUNS, JSON.stringify(updated));
  
  // Update stats
  const stats = getStats();
  stats.simulationCount += 1;
  stats.lastVisit = new Date().toISOString();
  
  if (result.scores.ethics >= 90) {
    stats.highEthicsCount += 1;
    if (stats.highEthicsCount >= 3 && !stats.badges.includes('윤리 수호자')) {
      stats.badges.push('윤리 수호자');
    }
  }

  saveStats(stats);
};

export const getSimulations = (): SimulationResult[] => {
  const data = localStorage.getItem(KEYS.RUNS);
  return data ? JSON.parse(data) : [];
};

export const saveQuizScore = (score: number, wrongIds: number[]) => {
  // Save wrong notes simply as IDs for now
  localStorage.setItem(KEYS.WRONG, JSON.stringify(wrongIds));
  
  const stats = getStats();
  stats.quizScore = Math.max(stats.quizScore, score);
  if (score >= 90 && !stats.badges.includes('협업 마스터')) {
    stats.badges.push('협업 마스터');
  }
  saveStats(stats);
};

export const getWrongNoteIds = (): number[] => {
  const data = localStorage.getItem(KEYS.WRONG);
  return data ? JSON.parse(data) : [];
};

export const getStats = (): UserStats => {
  const data = localStorage.getItem(KEYS.STATS);
  const defaultStats: UserStats = {
    simulationCount: 0,
    quizScore: 0,
    badges: [],
    streak: 1, // Simplified for this demo
    lastVisit: new Date().toISOString(),
    highEthicsCount: 0
  };
  return data ? { ...defaultStats, ...JSON.parse(data) } : defaultStats;
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
};