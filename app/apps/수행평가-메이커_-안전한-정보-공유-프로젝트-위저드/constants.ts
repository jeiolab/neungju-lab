import { DataCategory, DataItem, ProjectTopic, QuizQuestion, ConceptCardData, ProcessingMethod } from './types';

export const DATA_ITEMS: DataItem[] = [
  { id: 'd1', name: '이름', category: DataCategory.IDENTIFIER, isDirectIdentifier: true, riskLevel: 'high' },
  { id: 'd2', name: '주민등록번호', category: DataCategory.IDENTIFIER, isDirectIdentifier: true, riskLevel: 'high' },
  { id: 'd3', name: '휴대전화번호', category: DataCategory.IDENTIFIER, isDirectIdentifier: true, riskLevel: 'high' },
  { id: 'd4', name: '집 주소(상세)', category: DataCategory.IDENTIFIER, isDirectIdentifier: true, riskLevel: 'high' },
  { id: 'd5', name: '동/구 단위 거주지', category: DataCategory.GENERAL, isDirectIdentifier: false, riskLevel: 'low' },
  { id: 'd6', name: '성별', category: DataCategory.GENERAL, isDirectIdentifier: false, riskLevel: 'low' },
  { id: 'd7', name: '나이(생년월일 X)', category: DataCategory.GENERAL, isDirectIdentifier: false, riskLevel: 'low' },
  { id: 'd8', name: '급식 만족도 점수', category: DataCategory.BEHAVIOR, isDirectIdentifier: false, riskLevel: 'low' },
  { id: 'd9', name: '통학 소요 시간', category: DataCategory.BEHAVIOR, isDirectIdentifier: false, riskLevel: 'low' },
  { id: 'd10', name: '수면 시간', category: DataCategory.BEHAVIOR, isDirectIdentifier: false, riskLevel: 'low' },
  { id: 'd11', name: '학교폭력 피해 경험', category: DataCategory.SENSITIVE, isDirectIdentifier: false, riskLevel: 'high' },
  { id: 'd12', name: '가정형편/소득', category: DataCategory.SENSITIVE, isDirectIdentifier: false, riskLevel: 'high' },
  { id: 'd13', name: '질병/건강정보', category: DataCategory.SENSITIVE, isDirectIdentifier: false, riskLevel: 'high' },
];

export const TOPICS = Object.values(ProjectTopic);

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 '개인정보'에 해당하지 않는 것은?",
    options: ["홍길동의 이름", "A고등학교 1학년 3반 5번 학생의 성적", "대한민국 전체의 평균 기온", "010-1234-5678 전화번호"],
    correctAnswer: 2,
    explanation: "국가 전체 평균 기온과 같은 통계 데이터는 특정 개인을 식별할 수 없으므로 개인정보가 아닙니다.",
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "개인정보를 '가명처리' 한다는 것의 올바른 의미는?",
    options: ["데이터를 모두 삭제하는 것", "다른 정보와 결합 없이는 개인을 알아볼 수 없게 조치하는 것", "이름만 지우고 주소는 남겨두는 것", "비밀번호를 설정하는 것"],
    correctAnswer: 1,
    explanation: "가명처리는 원래의 상태로 복원하기 위한 추가 정보 없이는 특정 개인을 알아볼 수 없도록 조치하는 것입니다.",
    difficulty: 'medium'
  },
  {
    id: 3,
    question: "다음 중 가장 안전한 정보 공유 방법은?",
    options: ["친구 이름과 전화번호를 SNS에 올린다.", "설문조사 결과를 익명 통계로 변환하여 반 친구들과 공유한다.", "친구들의 성적표를 그대로 교실 뒤에 게시한다.", "주소록 엑셀 파일을 단체 채팅방에 올린다."],
    correctAnswer: 1,
    explanation: "익명 통계로 변환하여 공유하는 것이 프라이버시 침해 위험을 최소화합니다.",
    difficulty: 'easy'
  },
  {
    id: 4,
    question: "프로젝트 수행 시 '최소 수집의 원칙'이란?",
    options: ["가능한 많은 정보를 모으는 것", "나중에 쓸지도 모르니 미리 모으는 것", "목적에 필요한 최소한의 정보만 수집하는 것", "아무 정보도 수집하지 않는 것"],
    correctAnswer: 2,
    explanation: "개인정보 보호법에서는 목적 달성에 필요한 최소한의 정보만을 수집하도록 규정하고 있습니다.",
    difficulty: 'medium'
  },
  {
    id: 5,
    question: "민감정보에 해당하는 것은?",
    options: ["이메일 주소", "좋아하는 색깔", "정당 가입 여부 및 건강 정보", "학교 이름"],
    correctAnswer: 2,
    explanation: "사상, 신념, 건강, 범죄 경력 등은 민감정보로 분류되어 더욱 엄격하게 보호받아야 합니다.",
    difficulty: 'hard'
  }
];

export const CONCEPTS: ConceptCardData[] = [
  {
    title: "개인정보란?",
    content: "살아있는 개인에 관한 정보로서 성명, 주민등록번호 등을 통해 개인을 알아볼 수 있는 정보입니다. 다른 정보와 쉽게 결합하여 알아볼 수 있는 정보도 포함됩니다.",
    keyPoints: ["식별 가능성", "결합 용이성", "생존하는 개인"]
  },
  {
    title: "가명정보 vs 익명정보",
    content: "가명정보는 추가 정보가 있으면 식별 가능하지만, 익명정보는 시간/비용/노력을 들여도 더 이상 개인을 알아볼 수 없게 처리된 정보입니다.",
    keyPoints: ["가명: 추가 정보로 복구 가능", "익명: 복구 불가능", "활용 범위 차이"]
  },
  {
    title: "안전한 공유 3원칙",
    content: "1. 목적 명확화 (왜 필요한가?)\n2. 최소 수집 (꼭 필요한 것만)\n3. 안전 조치 (암호화, 가명처리 등)",
    keyPoints: ["목적 정당성", "수집 최소화", "안전 관리"]
  }
];

export const PROCESSING_DESCRIPTIONS: Record<ProcessingMethod, string> = {
  [ProcessingMethod.NONE]: "원본 그대로 사용합니다. 개인 식별 위험이 매우 높습니다.",
  [ProcessingMethod.PSEUDONYM]: "식별자를 삭제하거나 대체값(코드)으로 바꿉니다. 연구용으로 유용합니다.",
  [ProcessingMethod.AGGREGATION]: "개별 값이 아닌 통계값(평균, 합계)이나 범주(예: 10대)로 묶습니다.",
  [ProcessingMethod.ANONYMIZATION]: "식별 가능성을 완전히 제거하여 통계 데이터로 만듭니다."
};
