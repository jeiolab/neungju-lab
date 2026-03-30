export type Tab = 'theory' | 'simulation' | 'quiz' | 'essay';

export enum ThreatType {
  WORM = '웜 (Worm)',
  TROJAN = '트로이 목마 (Trojan)',
  RANSOMWARE = '랜섬웨어 (Ransomware)',
  PHISHING = '피싱 (Phishing)',
  DDOS = '디도스 (DDoS)',
}

export enum ToolType {
  ANTIVIRUS = '백신 검사',
  PATCH = '보안 패치',
  FIREWALL = '방화벽 설정',
  DECRYPTION = '복호화 키',
  EMAIL_FILTER = '스팸 필터',
}

export interface Threat {
  id: string;
  type: ThreatType;
  name: string;
  description: string;
  symptoms: string[];
  weakness: ToolType;
  difficulty: number; // 1-5
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}