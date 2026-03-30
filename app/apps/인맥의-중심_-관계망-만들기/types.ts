export interface FriendNode {
  id: string;
  name: string;
  hobby: string;
  group: number;
  // D3 simulation properties
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface FriendLink {
  source: string | FriendNode;
  target: string | FriendNode;
  value: number;
  // D3 link properties
  index?: number;
}

export interface GraphData {
  nodes: FriendNode[];
  links: FriendLink[];
}

export enum UserLevel {
  BEGINNER = "골목대장",
  INTERMEDIATE = "인플루언서",
  EXPERT = "네트워크 관리자"
}

export interface QuizData {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
  graph?: GraphData; // Specific graph for the quiz
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}