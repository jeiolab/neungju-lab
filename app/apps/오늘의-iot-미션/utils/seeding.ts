// A simple pseudo-random number generator based on a seed string
// This ensures all users see the same content on the same day
export const getDailySeed = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const mulberry32 = (a: number) => {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export const getRandomItem = <T>(array: T[], seed: string): T => {
  const hash = stringToHash(seed);
  const random = mulberry32(hash);
  const index = Math.floor(random() * array.length);
  return array[index];
};

export const shuffleArray = <T>(array: T[], seed: string): T[] => {
  const hash = stringToHash(seed);
  const random = mulberry32(hash);
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
