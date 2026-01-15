import { EvaluationCriteria, DecisionType } from './types';

// PII Detection Regex
export const containsPII = (text: string): boolean => {
  const phoneRegex = /01[0-9]-?[0-9]{3,4}-?[0-9]{4}/;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const addressRegex = /(시|도|구|군|동|가|번지|길)\s+[0-9]+/;
  
  return phoneRegex.test(text) || emailRegex.test(text) || addressRegex.test(text);
};

// Calculate Score based on criteria
export const calculateMLScore = (criteria: EvaluationCriteria): number => {
  return Object.values(criteria).reduce((a, b) => a + b, 0);
};

// Determine Verdict based on Score
export const getVerdict = (score: number): DecisionType => {
  if (score <= 14) return 'NO_ML';
  if (score <= 22) return 'HARD_ML'; // Conditional/Review needed, mapped to HARD/Check for logic
  return 'YES_ML';
};

// Simple date formatter
export const getTodayString = () => new Date().toISOString().split('T')[0];

export const checkStreak = (lastDate: string): number => {
  const today = new Date();
  const last = new Date(lastDate);
  const diffTime = Math.abs(today.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (getTodayString() === lastDate) return 0; // Already played today, maintain current
  if (diffDays === 1) return 1; // Yesterday
  return -1; // Reset
};
