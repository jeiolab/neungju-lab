export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  problem: string;
  consequence: string;
  lesson: string;
}

export type AppTab = 'theory' | 'simulation' | 'cases' | 'quiz' | 'dilemma' | 'summary';

export interface SimulationState {
  step: number;
  topic: string | null;
  features: string[];
  modelType: 'classification' | 'regression' | null;
  ethicalChecks: string[];
  generatedProposal: string | null;
  isGenerating: boolean;
}

export const TOPICS = [
  { id: 'hiring', name: '채용 (HR)', type: 'classification', description: '지원자 합격/불합격 예측' },
  { id: 'medical', name: '의료 (Medical)', type: 'classification', description: '질병 유무 진단' },
  { id: 'finance', name: '금융 (Finance)', type: 'regression', description: '신용 점수 또는 주가 예측' },
  { id: 'retail', name: '유통 (Retail)', type: 'regression', description: '상품 수요량 예측' },
];

export const FEATURES = [
  { id: 'age', name: '나이' },
  { id: 'gender', name: '성별' },
  { id: 'income', name: '소득 수준' },
  { id: 'address', name: '거주지 (우편번호)' },
  { id: 'education', name: '학력' },
  { id: 'experience', name: '경력 연수' },
  { id: 'health_history', name: '과거 병력' },
  { id: 'purchase_history', name: '구매 이력' },
];

export const MODELS = [
  { id: 'classification', name: '분류 (Classification)', desc: 'Yes/No 또는 카테고리를 예측합니다.' },
  { id: 'regression', name: '회귀 (Regression)', desc: '연속적인 숫자 값을 예측합니다.' },
];