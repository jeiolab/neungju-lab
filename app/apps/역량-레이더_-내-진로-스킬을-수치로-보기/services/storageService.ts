import { UserData, CompetencyType, COMPETENCIES } from '../types';

const STORAGE_KEY = 'skillRadar_v1_userData';

const INITIAL_DATA: UserData = {
  name: '학생',
  selectedJobId: null,
  xp: 0,
  level: 1,
  streak: 0,
  lastLoginDate: '',
  baselineScores: {
    knowledge: 3,
    computational: 3,
    creative: 3,
    communication: 3,
    community: 3
  },
  actionPlanChecks: {},
  quizStats: {
    knowledge: { correct: 0, total: 0 },
    computational: { correct: 0, total: 0 },
    creative: { correct: 0, total: 0 },
    communication: { correct: 0, total: 0 },
    community: { correct: 0, total: 0 },
  },
  scenarioStats: {
    knowledge: { correct: 0, total: 0 },
    computational: { correct: 0, total: 0 },
    creative: { correct: 0, total: 0 },
    communication: { correct: 0, total: 0 },
    community: { correct: 0, total: 0 },
  },
  wrongNotes: [],
  badges: []
};

export const loadUserData = (): UserData => {
  try {
    if (typeof window === 'undefined') {
      return INITIAL_DATA;
    }
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_DATA;
  } catch (e) {
    console.error("Failed to load user data", e);
    return INITIAL_DATA;
  }
};

export const saveUserData = (data: UserData) => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save user data", e);
  }
};

export const calculateMastery = (
  userData: UserData,
  competency: CompetencyType
): number => {
  // Mastery (0~100) = (Quiz% * 60) + (Action * 20) + (Scenario% * 20)
  
  // 1. Quiz (60%)
  const quiz = userData.quizStats[competency];
  const quizScore = quiz.total === 0 ? 0 : (quiz.correct / quiz.total) * 100;
  
  // 2. Action (20%) - Check last 7 days. If checked, give points.
  // Simplified: Count total checks for this competency ever (capped at some logical max for "mastery" visualization, e.g., 20 checks = full points)
  // For this version, let's look at checks in the last 30 days.
  const checkCount = Object.keys(userData.actionPlanChecks).filter(key => 
    key.endsWith(`_${competency}`)
  ).length;
  // Cap at 20 actions for full marks in this component
  const actionScore = Math.min(checkCount * 5, 100);

  // 3. Scenario (20%)
  const scenario = userData.scenarioStats[competency];
  const scenarioScore = scenario.total === 0 ? 0 : (scenario.correct / scenario.total) * 100;

  const total = (quizScore * 0.6) + (actionScore * 0.2) + (scenarioScore * 0.2);
  
  // Base it slightly on the self-diagnosis baseline to start (so it's not 0)
  const baseline = (userData.baselineScores[competency] / 5) * 100;
  
  // Weighted average: 30% baseline + 70% calculated activity
  // If no activity yet, show baseline.
  if (quiz.total === 0 && scenario.total === 0 && checkCount === 0) {
      return baseline;
  }

  return Math.round((baseline * 0.3) + (total * 0.7));
};

export const checkBadges = (userData: UserData): string[] => {
  const newBadges: string[] = [];
  
  // Streak Badge
  if (userData.streak >= 7 && !userData.badges.includes('legend_streak_7')) {
    newBadges.push('legend_streak_7');
  }
  
  // Communication Badge
  const commChecks = Object.keys(userData.actionPlanChecks).filter(k => k.endsWith('_communication')).length;
  if (commChecks >= 10 && !userData.badges.includes('communication_master_10')) {
    newBadges.push('communication_master_10');
  }

  return newBadges;
};
