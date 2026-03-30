export type SoundType = 'drums' | 'piano' | 'mix';

export type CompressionMode = 'lossless' | 'mp3' | 'low_quality';

export interface AudioState {
  isPlaying: boolean;
  soundType: SoundType;
  compressionMode: CompressionMode;
  volume: number;
}

export interface Concept {
  id: string;
  title: string;
  description: string;
  visualIcon: string;
}
