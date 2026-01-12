/**
 * A simple educational encryption service.
 * It uses XOR cipher combined with Hex encoding to make it visually "cypher-like"
 * but easily reversible for demonstration purposes.
 */

// Converts a string to an array of character codes (supports Unicode/Korean)
const stringToCodes = (str: string): number[] => {
  const codes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.codePointAt(i);
    if (code !== undefined) {
      codes.push(code);
    }
  }
  return codes;
};

// Converts an array of character codes back to a string
const codesToString = (codes: number[]): string => {
  return String.fromCodePoint(...codes);
};

// Formatting helper: Numbers to Hex String (e.g., 255 -> "FF")
const codesToHex = (codes: number[]): string => {
  return codes.map(c => c.toString(16).padStart(4, '0')).join(' ');
};

// Formatting helper: Hex String to Numbers
const hexToCodes = (hex: string): number[] => {
  // Remove spaces and split by 4 chars (since we padded with 4)
  const cleanHex = hex.replace(/\s/g, '');
  const codes: number[] = [];
  for (let i = 0; i < cleanHex.length; i += 4) {
    const chunk = cleanHex.substring(i, i + 4);
    if (chunk) {
      codes.push(parseInt(chunk, 16));
    }
  }
  return codes;
};

/**
 * Encrypts plaintext using a key via XOR operation.
 * Output is formatted as a Hex string for visual effect.
 */
export const encryptMessage = (plaintext: string, key: string): string => {
  if (!plaintext || !key) return "";

  const textCodes = stringToCodes(plaintext);
  const keyCodes = stringToCodes(key);

  const encryptedCodes = textCodes.map((code, index) => {
    // Cycle through key codes
    const keyCode = keyCodes[index % keyCodes.length];
    // XOR operation
    return code ^ keyCode;
  });

  // Return as Hex string for that "encrypted look"
  return codesToHex(encryptedCodes).toUpperCase();
};

/**
 * Decrypts the hex-formatted ciphertext using the key.
 * If the key is wrong, it naturally produces garbage text (XOR property).
 */
export const decryptMessage = (ciphertext: string, key: string): string => {
  if (!ciphertext || !key) return "";

  try {
    const encryptedCodes = hexToCodes(ciphertext);
    const keyCodes = stringToCodes(key);

    const decryptedCodes = encryptedCodes.map((code, index) => {
      const keyCode = keyCodes[index % keyCodes.length];
      return code ^ keyCode;
    });

    return codesToString(decryptedCodes);
  } catch (e) {
    return "오류: 잘못된 암호 형식";
  }
};

/**
 * Generates a random "garbage" string for animation purposes
 */
export const generateRandomChars = (length: number): string => {
  const chars = "!@#$%^&*()_+{}:<>?1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz가나다라마바사아자차카타파하";
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};