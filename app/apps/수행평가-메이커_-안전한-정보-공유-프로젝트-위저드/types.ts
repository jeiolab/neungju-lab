export enum ProjectTopic {
  SAFETY = "학교 주변 안전 지도 만들기",
  LUNCH = "급식 만족도 및 선호 메뉴 분석",
  COMMUTE = "학생 통학 거리와 시간 분석",
  HEALTH = "청소년 수면 시간과 집중력 관계",
  CUSTOM = "직접 입력 (기타 주제)"
}

export enum DataCategory {
  IDENTIFIER = "직접식별정보(차단)",
  SENSITIVE = "민감정보(주의)",
  BEHAVIOR = "행태정보",
  GENERAL = "일반정보"
}

export interface DataItem {
  id: string;
  name: string;
  category: DataCategory;
  isDirectIdentifier: boolean; // True if it should be blocked immediately (e.g., Name, Phone)
  riskLevel: 'high' | 'medium' | 'low';
}

export enum ProcessingMethod {
  NONE = "원본 사용 (위험)",
  PSEUDONYM = "가명 처리 (코드화)",
  AGGREGATION = "통계 처리 (범주화/평균)",
  ANONYMIZATION = "익명 처리 (삭제)"
}

export enum DisclosureScope {
  TEACHER = "선생님만 확인",
  CLASS = "우리 반 친구들",
  GRADE = "우리 학교 1학년",
  SCHOOL = "학교 전체",
  PUBLIC = "외부 공개 (인터넷)"
}

export interface ProjectState {
  topic: string;
  selectedDataIds: string[];
  processingMethods: Record<string, ProcessingMethod>; // dataId -> method
  disclosureScope: DisclosureScope;
  description: string;
  safetyScore: number;
  utilityScore: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ConceptCardData {
  title: string;
  content: string;
  keyPoints: string[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'action';
  targetValue?: any;
}