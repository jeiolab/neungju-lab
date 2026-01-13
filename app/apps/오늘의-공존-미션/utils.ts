// Simple Linear Congruential Generator for seeded random
export const seededRandom = (seed: number) => {
  const m = 0x80000000;
  const a = 1103515245;
  const c = 12345;
  let state = seed ? seed : Math.floor(Math.random() * (m - 1));

  return {
    nextFloat: () => {
      state = (a * state + c) % m;
      return state / (m - 1);
    },
    nextInt: (min: number, max: number) => {
      state = (a * state + c) % m;
      return min + Math.floor((state / (m - 1)) * (max - min));
    }
  };
};

export const getTodaySeed = (): number => {
  const now = new Date();
  // Format: YYYYMMDD
  return parseInt(
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  );
};

export const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const getDaysDifference = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};