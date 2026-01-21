export type FileType = 'text' | 'image' | 'audio';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  originalSizeKB: number; // Size in KB
  contentPreview?: string; // URL or text snippet
}

export type MachineType = 'lossless' | 'lossy';

export interface SimulationResult {
  fileId: string;
  machineType: MachineType;
  compressedSizeKB: number;
  compressionRatio: number; // Percentage
  transferTimeOriginal: number; // Seconds
  transferTimeCompressed: number; // Seconds
  quality: number; // 0-100 scale
  success: boolean;
  message: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  title: string;
  completedQuizzes: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
