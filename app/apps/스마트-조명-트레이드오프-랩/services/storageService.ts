import { Design, UserProgress, QuizResult } from '../types';

const KEYS = {
  DESIGNS: 'iot_app2_designs',
  PROGRESS: 'iot_app2_progress',
  QUIZ_RESULTS: 'iot_app2_quiz_results',
  WRONG_NOTES: 'iot_app2_wrong_notes',
};

const getJSON = <T>(key: string, distinct: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : distinct;
  } catch (e) {
    console.error(`Error reading ${key}`, e);
    return distinct;
  }
};

const setJSON = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key}`, e);
  }
};

export const storageService = {
  getDesigns: (): Design[] => getJSON(KEYS.DESIGNS, []),
  saveDesign: (design: Design) => {
    const designs = getJSON<Design[]>(KEYS.DESIGNS, []);
    designs.unshift(design); // Add to top
    setJSON(KEYS.DESIGNS, designs);
  },
  
  getProgress: (): UserProgress => getJSON(KEYS.PROGRESS, {
    level: 1,
    xp: 0,
    badges: [],
    streak: 0,
    lastLogin: new Date().toISOString(),
    designsCount: 0
  }),
  saveProgress: (progress: UserProgress) => setJSON(KEYS.PROGRESS, progress),

  getQuizResults: (): QuizResult[] => getJSON(KEYS.QUIZ_RESULTS, []),
  saveQuizResult: (result: QuizResult) => {
    const results = getJSON<QuizResult[]>(KEYS.QUIZ_RESULTS, []);
    results.push(result);
    setJSON(KEYS.QUIZ_RESULTS, results);
  },

  getWrongNotes: (): number[] => getJSON(KEYS.WRONG_NOTES, []),
  saveWrongNotes: (ids: number[]) => setJSON(KEYS.WRONG_NOTES, ids),
};
