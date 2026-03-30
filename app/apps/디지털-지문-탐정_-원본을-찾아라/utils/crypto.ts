/**
 * Computes SHA-256 hash of a string using Web Crypto API
 */
export const computeHash = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

/**
 * Simulates a file hash based on name + fake content metadata
 */
export const simulateFileHash = async (filename: string, modified: boolean): Promise<string> => {
  // We append a secret salt if it's "modified" to guarantee a different hash
  // even if the filename looks the same in the UI logic.
  const content = `${filename}-${modified ? 'TAMPERED_DATA' : 'ORIGINAL_DATA'}-${new Date().getFullYear()}`;
  return computeHash(content);
};
