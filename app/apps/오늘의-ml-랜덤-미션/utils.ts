import { MissionType } from './types';

// Simple Linear Congruential Generator for seeding
export const seededRandom = (seed: number) => {
  const m = 0x80000000;
  const a = 1103515245;
  const c = 12345;
  seed = (a * seed + c) % m;
  return seed / (m - 1);
};

export const getTodayString = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const getSeedFromDate = (dateStr: string) => {
  // dateStr format YYYY-MM-DD -> integer
  return parseInt(dateStr.replace(/-/g, ''), 10);
};

export const selectDailyMissionType = (dateStr: string): MissionType => {
  const seed = getSeedFromDate(dateStr);
  const rand = seededRandom(seed);
  
  const types = [
    MissionType.OX_REASON,
    MissionType.CLASSIFICATION,
    MissionType.PIPELINE_PUZZLE,
    MissionType.DATA_ISSUE
  ];
  
  return types[Math.floor(rand * types.length)];
};

export const calculateMasteryColor = (score: number) => {
  if (score >= 80) return 'text-emerald-600 bg-emerald-100';
  if (score >= 50) return 'text-amber-600 bg-amber-100';
  return 'text-rose-600 bg-rose-100';
};

export const SAMPLE_BADGES = [
  { id: 'streak_3', name: '작심삼일 탈출', icon: '🔥', description: '3일 연속 학습 달성' },
  { id: 'streak_7', name: '일주일의 기적', icon: '⚡', description: '7일 연속 학습 달성' },
  { id: 'streak_30', name: 'ML 마스터', icon: '👑', description: '30일 연속 학습 달성' },
  { id: 'mission_50', name: '성실의 아이콘', icon: '🎖️', description: '총 미션 50회 수행' },
];

export const ML_TOPICS = [
  "Linear Regression", "Logistic Regression", "Decision Trees", "Random Forest",
  "SVM", "K-Means Clustering", "Neural Networks", "CNN", "RNN", "Transformers",
  "Data Cleaning", "Feature Engineering", "Overfitting/Underfitting", "Cross Validation",
  "Precision/Recall", "ROC/AUC", "Gradient Descent", "Bias-Variance Tradeoff"
];
