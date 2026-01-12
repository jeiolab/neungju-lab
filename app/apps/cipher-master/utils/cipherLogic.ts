import { ALPHABET } from '../types';

/**
 * Encrypts a string using Caesar Cipher.
 * Handles negative shifts and wraps around 26.
 * Preserves non-alphabetic characters.
 */
export const caesarCipher = (text: string, shift: number): string => {
  return text.toUpperCase().split('').map(char => {
    const index = ALPHABET.indexOf(char);
    if (index === -1) return char; // Non-alphabetic characters pass through

    // JavaScript % operator can return negative values, so we handle wrap around manually
    let newIndex = (index + shift) % 26;
    if (newIndex < 0) newIndex += 26;
    
    return ALPHABET[newIndex];
  }).join('');
};

/**
 * Decrypts a string (simply encrypts with negative shift).
 */
export const caesarDecrypt = (text: string, shift: number): string => {
  return caesarCipher(text, -shift);
};

/**
 * Generates a random quiz question.
 */
export const generateQuestion = (): { plain: string, cipher: string, shift: number } => {
  const words = ['REACT', 'CODE', 'LOGIC', 'CIPHER', 'SECRET', 'WHEEL', 'PUZZLE', 'SMART', 'BRAIN', 'DEBUG'];
  const word = words[Math.floor(Math.random() * words.length)];
  const shift = Math.floor(Math.random() * 25) + 1; // 1 to 25
  const cipher = caesarCipher(word, shift);
  
  return {
    plain: word,
    cipher: cipher,
    shift: shift
  };
};
