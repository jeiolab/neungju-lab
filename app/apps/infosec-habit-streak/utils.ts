import { MISSIONS_POOL } from './constants';
import { Mission } from './types';

// Seeded Random Number Generator based on date
export const getMissionForDate = (dateStr: string): Mission => {
  // Simple hash function for the date string (YYYY-MM-DD)
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Use absolute value and modulo by pool length
  const index = Math.abs(hash) % MISSIONS_POOL.length;
  return MISSIONS_POOL[index];
};

export const getTodayDateString = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateDaysDifference = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const maskPII = (text: string): string => {
  // Basic Regex for Korean Phone Numbers (010-XXXX-XXXX)
  let masked = text.replace(/(01[016789])[- .]?(\d{3,4})[- .]?(\d{4})/g, '$1-****-$3');
  
  // Basic Regex for Emails
  masked = masked.replace(/([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g, (match, p1, p2) => {
    return `${p1.substring(0, 3)}****@${p2}`;
  });

  // Basic Regex for Resident Number-like patterns (6 digits - 7 digits)
  masked = masked.replace(/(\d{6})[- .]?(\d{7})/g, '$1-*******');
  
  // Mask generic proper names (simple heuristic: 3 char words starting with Kim/Lee/Park - tough in plain JS without NLP, skipping for simple demo, focusing on regex patterns)
  
  return masked;
};
