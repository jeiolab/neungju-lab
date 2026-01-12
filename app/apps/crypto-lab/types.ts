export type CryptoMode = 'encrypt' | 'decrypt';

export interface EncryptionResult {
  success: boolean;
  text: string;
  isGarbled?: boolean;
}

export interface AnimationState {
  isAnimating: boolean;
  progress: number; // 0 to 100
}