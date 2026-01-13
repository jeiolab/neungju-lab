/**
 * Shifts a single character by the given amount.
 * Only shifts A-Z and a-z. Preserves case.
 */
export const shiftChar = (char: string, shift: number): string => {
  const code = char.charCodeAt(0);
  
  // Uppercase A-Z (65-90)
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
  }
  
  // Lowercase a-z (97-122)
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
  }
  
  return char;
};

/**
 * Performs Caesar cipher on a string.
 */
export const caesarCipher = (text: string, shift: number, decrypt: boolean = false): string => {
  const effectiveShift = decrypt ? -shift : shift;
  return text.split('').map(char => shiftChar(char, effectiveShift)).join('');
};

/**
 * Analyzes frequency of letters in text and returns top 3 likely keys.
 * Assumption: 'e' is the most frequent letter in English.
 */
export const autoGuessKeys = (text: string): { key: number; confidence: string }[] => {
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
  if (cleanText.length === 0) return [];

  const counts: Record<string, number> = {};
  for (const char of cleanText) {
    counts[char] = (counts[char] || 0) + 1;
  }

  const sortedChars = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([char]) => char);

  // Top frequent letters in ciphertext vs 'E' (most frequent in English)
  // Cipher = Plain + Key => Key = Cipher - Plain
  // Guess 1: Most frequent ciphertext char corresponds to 'E'
  // Guess 2: Most frequent ciphertext char corresponds to 'T'
  // Guess 3: Most frequent ciphertext char corresponds to 'A'
  
  const suggestions: { key: number; confidence: string }[] = [];
  
  // Strategy: Map top frequent char in text to 'E' (code 69)
  if (sortedChars.length > 0) {
    const topChar = sortedChars[0].charCodeAt(0);
    // Key = (Cipher - 'E')
    let key = (topChar - 69); 
    if (key < 0) key += 26;
    suggestions.push({ key: key % 26, confidence: '높음 (E 기준)' });
  }

  // Strategy: Map 2nd frequent char to 'T' (code 84) or top to 'T'
  if (sortedChars.length > 0) {
      const topChar = sortedChars[0].charCodeAt(0);
      let key = (topChar - 84); // T
      if (key < 0) key += 26;
      if (!suggestions.find(s => s.key === key)) {
          suggestions.push({ key: key % 26, confidence: '중간 (T 기준)' });
      }
  }

   // Strategy: Map top frequent char to 'A' (code 65)
   if (sortedChars.length > 0) {
      const topChar = sortedChars[0].charCodeAt(0);
      let key = (topChar - 65); // A
      if (key < 0) key += 26;
       if (!suggestions.find(s => s.key === key)) {
          suggestions.push({ key: key % 26, confidence: '낮음 (A 기준)' });
      }
  }

  return suggestions.slice(0, 3);
};
