export type TabType = 'classroom' | 'wizard' | 'citation' | 'quiz' | 'gallery';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface CitationData {
  type: 'website' | 'book' | 'video' | 'news';
  author: string;
  title: string;
  source: string; // Publisher, Website Name, or Channel Name
  url?: string;
  date?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  author: string;
  type: string; // e.g., "포스터", "영상"
  ccl: string; // e.g., "CC BY-NC"
  imageUrl: string;
}

export interface LicenseConfig {
  commercial: boolean; // True = Allow, False = Non-Commercial (NC)
  modification: 'yes' | 'no' | 'sa'; // Yes, No (ND), ShareAlike (SA)
}