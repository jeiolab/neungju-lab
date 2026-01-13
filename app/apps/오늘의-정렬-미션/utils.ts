// Simple Linear Congruential Generator for deterministic randomness based on date
export class SeededRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Returns a pseudo-random number between 0 and 1
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  // Returns integer range [min, max]
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Pick random element from array
  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

export const getTodayString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const dateToSeed = (dateStr: string): number => {
  // YYYY-MM-DD -> integer seed
  return parseInt(dateStr.replace(/-/g, ''));
};

export const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const getBadgeList = (stats: any) => { // using any to avoid circular dep issues in utils, typed in components
  const badges = [];
  if (stats.currentStreak >= 7) badges.push({ id: 'streak7', name: '7일 연속', icon: '🔥', color: 'bg-orange-100 text-orange-600' });
  if (stats.currentStreak >= 14) badges.push({ id: 'streak14', name: '14일 연속', icon: '⚡', color: 'bg-yellow-100 text-yellow-600' });
  if (stats.currentStreak >= 30) badges.push({ id: 'streak30', name: '정렬 마스터', icon: '👑', color: 'bg-purple-100 text-purple-600' });
  if (stats.xp >= 1000) badges.push({ id: 'xp1000', name: '레벨업 장인', icon: '🎓', color: 'bg-blue-100 text-blue-600' });
  return badges;
};
