export interface WizardState {
  interest: string;
  agentTasks: string[];
  dataTypes: string[];
  risks: string[];
  humanTasks: string[];
  completed: boolean;
}

export interface SimulationState {
  dataSensitivity: number; // 1-10
  verificationIntensity: number; // 1-10
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // Index
  explanation: string;
  category: '문제정의' | '검증' | '윤리' | '개인정보' | '책임' | '진로';
}

export interface DiscussionItem {
  id: number;
  title: string;
  prompt: string;
  userAnswer: string;
}

export type TabType = 'concepts' | 'wizard' | 'learn' | 'quiz' | 'discussion';

export const JOB_INTERESTS = ['간호/보건', '게임/SW개발', '교사/교육', '마케팅/경영', '디자인/예술', '공학/기술', '기타'];

export const AGENT_TASK_OPTIONS = [
  '직업 정보 탐색 및 요약',
  '자기소개서 초안 작성',
  '적성 검사 결과 분석',
  '관련 학과/대학 추천',
  '면접 예상 질문 생성',
  '학습 계획 스케줄링'
];

export const DATA_TYPE_OPTIONS = [
  { label: '학교 생활기록부 (민감)', value: 'saenggi', sensitive: true },
  { label: '성적 데이터 (민감)', value: 'grades', sensitive: true },
  { label: '관심 직업 키워드 (일반)', value: 'keywords', sensitive: false },
  { label: '공개된 대학 입시 요강 (일반)', value: 'public_info', sensitive: false },
  { label: '사용자 성향/MBTI (일반)', value: 'mbti', sensitive: false }
];

export const RISK_OPTIONS = [
  '알고리즘 편향 (특정 직업군 추천 쏠림)',
  '개인정보 유출 (성적/생기부)',
  'AI 의존도 심화 (스스로 고민하지 않음)',
  '책임 소재 불분명 (잘못된 조언으로 인한 피해)',
  '할루시네이션 (존재하지 않는 전형 정보 제공)'
];

export const HUMAN_TASK_OPTIONS = [
  '최종 결정 (진로 선택)',
  '정보 검증 (AI가 준 정보 사실 확인)',
  '윤리 점검 (편향성 확인)',
  '감정적 지지 (상담)',
  '데이터 입력 (단순 반복)',
  'AI 서버 관리'
];