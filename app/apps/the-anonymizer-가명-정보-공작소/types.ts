export enum DataCategory {
  IDENTIFIER = '식별자', // 이름, 주민번호
  QUASI_IDENTIFIER = '준식별자', // 주소, 나이, 성별
  SENSITIVE = '민감정보', // 병력, 범죄경력
  NON_IDENTIFIER = '일반정보' // 구매내역 등
}

export interface RawDataField {
  id: string;
  name: string; // e.g., "이름"
  value: string; // e.g., "김철수"
  category: DataCategory;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  requiredUtility: number; // 0-100
  requiredSafety: number; // 0-100
  data: RawDataField[];
  context: string; // e.g., "연구 목적 데이터셋"
}

export interface Tool {
  id: string;
  name: string;
  type: 'DELETE' | 'MASK' | 'CATEGORY' | 'ROUND' | 'ENCRYPT';
  description: string;
  utilityCost: number; // How much utility is lost
  safetyGain: number; // How much safety is gained
  icon: string;
}

export interface PipelineStep {
  fieldId: string;
  toolId: string;
}

export interface EvaluationResult {
  safetyScore: number;
  utilityScore: number;
  transformedData: Record<string, string>;
  feedback: string;
  isSuccess: boolean;
}

export interface UserState {
  coins: number;
  unlockedSkins: string[];
  currentSkin: string;
}