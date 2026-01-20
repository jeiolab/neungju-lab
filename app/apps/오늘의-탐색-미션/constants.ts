// Seeded random number generator (Linear Congruential Generator)
export class Seeder {
  private seed: number;

  constructor(seedStr: string) {
    // Simple hash to convert string to number
    let h = 0x811c9dc5;
    for (let i = 0; i < seedStr.length; i++) {
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    this.seed = h >>> 0;
  }

  // Returns a float between 0 and 1
  random(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  // Returns integer between min and max (inclusive)
  range(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }
}

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const LEVELS = [
  { xp: 0, title: '초보 탐험가' },
  { xp: 100, title: '길잡이' },
  { xp: 300, title: '항해사' },
  { xp: 600, title: '미로 마스터' },
  { xp: 1000, title: '그래프의 전설' },
];

export const LEVEL_XP_GAIN = 50; // XP per mission
export const QUIZ_XP_GAIN = 5; // XP per correct quiz answer