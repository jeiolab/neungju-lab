import { SDG, QuizQuestion } from './types';

export const SDGS: SDG[] = [
  { id: 1, name: "빈곤 퇴치", description: "모든 곳에서 모든 형태의 빈곤 종식", color: "bg-red-500" },
  { id: 2, name: "기아 종식", description: "기아 종식, 식량 안보 달성", color: "bg-yellow-500" },
  { id: 3, name: "건강과 웰빙", description: "건강한 삶 보장 및 웰빙 증진", color: "bg-green-500" },
  { id: 4, name: "양질의 교육", description: "포용적이고 공평한 양질의 교육 보장", color: "bg-red-700" },
  { id: 5, name: "성 평등", description: "성 평등 달성 및 여성 역량 강화", color: "bg-orange-500" },
  { id: 6, name: "깨끗한 물과 위생", description: "물과 위생의 이용 가능성 보장", color: "bg-cyan-500" },
  { id: 7, name: "에너지", description: "적정 가격의 깨끗한 에너지 보장", color: "bg-yellow-400" },
  { id: 8, name: "일자리와 경제 성장", description: "지속 가능한 경제 성장 촉진", color: "bg-red-800" },
  { id: 9, name: "산업, 혁신, 인프라", description: "탄력적인 인프라 구축", color: "bg-orange-600" },
  { id: 10, name: "불평등 감소", description: "국가 내 및 국가 간 불평등 감소", color: "bg-pink-600" },
  { id: 11, name: "지속 가능한 도시", description: "포용적이고 안전한 도시 조성", color: "bg-orange-400" },
  { id: 12, name: "책임 있는 소비와 생산", description: "지속 가능한 소비 및 생산 패턴 보장", color: "bg-yellow-600" },
  { id: 13, name: "기후 행동", description: "기후 변화 대응을 위한 긴급 조치", color: "bg-green-700" },
  { id: 14, name: "해양 생태계", description: "해양 자원의 보존 및 지속 가능한 사용", color: "bg-blue-500" },
  { id: 15, name: "육상 생태계", description: "육상 생태계 보호 및 복원", color: "bg-green-600" },
  { id: 16, name: "평화, 정의, 제도", description: "평화롭고 포용적인 사회 증진", color: "bg-blue-700" },
  { id: 17, name: "파트너십", description: "이행 수단 강화 및 글로벌 파트너십 활성화", color: "bg-indigo-700" },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "기계학습 프로젝트에서 가장 먼저 해야 할 단계는?",
    options: ["데이터 수집", "모델 학습", "문제 정의", "웹사이트 제작"],
    correctIndex: 2,
    explanation: "명확한 문제 정의(현재 상태 vs 목표 상태)가 없으면 적절한 데이터와 모델을 결정할 수 없습니다."
  },
  {
    id: 2,
    question: "다음 중 지도학습(Supervised Learning)에 필요한 데이터는?",
    options: ["입력 데이터만", "정답(레이블)이 있는 데이터", "무작위 데이터", "규칙만 있는 데이터"],
    correctIndex: 1,
    explanation: "지도학습은 입력(특성)과 정답(레이블) 쌍을 통해 모델을 학습시킵니다."
  },
  {
    id: 3,
    question: "개인정보 보호를 위해 수집하지 말아야 할 정보는?",
    options: ["날씨 기온", "익명화된 설문 결과", "주민등록번호", "지역별 강수량"],
    correctIndex: 2,
    explanation: "주민등록번호, 전화번호 등 개인을 식별할 수 있는 정보(PII)는 수집해서는 안 됩니다."
  },
  {
    id: 4,
    question: "급식 잔반량을 예측하여 줄이고자 합니다. 어떤 모델 유형이 적합할까요?",
    options: ["분류(Classification)", "회귀(Regression)", "군집(Clustering)", "강화학습"],
    correctIndex: 1,
    explanation: "잔반의 '양'(수치)을 예측하는 문제는 회귀(Regression) 문제입니다."
  },
  {
    id: 5,
    question: "데이터가 부족할 때 할 수 있는 대안으로 적절하지 않은 것은?",
    options: ["공공 데이터 포털 검색", "직접 설문 조사 수행", "데이터를 임의로 조작하여 늘리기", "비슷한 문제의 데이터 활용"],
    correctIndex: 2,
    explanation: "데이터를 임의로 조작하면 모델이 왜곡된 현실을 배우게 되어 성능을 신뢰할 수 없습니다."
  },
   {
    id: 6,
    question: "학교 폭력 여부를 '폭력/비폭력'으로 구분하는 모델은 무엇인가요?",
    options: ["회귀 모델", "분류 모델", "생성 모델", "군집 모델"],
    correctIndex: 1,
    explanation: "범주(Category)를 예측하는 것은 분류(Classification)입니다."
  },
  {
    id: 7,
    question: "AI 윤리 체크리스트에서 '편향성(Bias)'이란?",
    options: ["데이터가 너무 많은 것", "특정 집단에 유리하거나 불리한 결과가 나오는 것", "모델 속도가 느린 것", "비용이 많이 드는 것"],
    correctIndex: 1,
    explanation: "편향성은 데이터나 알고리즘이 특정 그룹을 차별하거나 공정하지 않은 결과를 내는 것을 의미합니다."
  },
  {
    id: 8,
    question: "모델 성능 평가 시 '정확도(Accuracy)'만 믿으면 안 되는 이유는?",
    options: ["계산이 너무 쉬워서", "데이터 불균형 시 실제 성능을 반영 못할 수 있어서", "숫자가 너무 커서", "항상 100%가 나오기 때문에"],
    correctIndex: 1,
    explanation: "희귀한 사건(예: 암 진단)의 경우, 무조건 '음성'이라고만 답해도 정확도는 높지만 실제 성능은 꽝일 수 있습니다."
  },
  {
    id: 9,
    question: "머신러닝이 학습할 수 없는 데이터는?",
    options: ["수치형 데이터", "이미지 데이터", "패턴이 전혀 없는 무작위 데이터", "텍스트 데이터"],
    correctIndex: 2,
    explanation: "기계학습은 데이터 내의 '패턴'을 찾는 과정입니다. 패턴이 없는 랜덤 데이터는 학습할 수 없습니다."
  },
  {
    id: 10,
    question: "SDGs 4번 목표와 관련 깊은 AI 프로젝트 주제는?",
    options: ["해양 쓰레기 탐지", "맞춤형 학습 콘텐츠 추천", "산불 발생 예측", "도시 소음 분석"],
    correctIndex: 1,
    explanation: "SDGs 4번은 '양질의 교육'입니다. 맞춤형 학습 추천은 교육 기회를 증진하는 좋은 예시입니다."
  }
];

export const ROLE_CARDS = [
  { title: "기획자 (PM)", desc: "문제 정의 및 전체 일정 관리, SDGs 목표 연결" },
  { title: "데이터 수집가", desc: "필요한 데이터 탐색, 설문 설계, 공공데이터 다운로드" },
  { title: "데이터 분석가", desc: "데이터 전처리(이상치 제거), 시각화, 통계 분석" },
  { title: "AI 개발자", desc: "모델 선정(Teachable Machine 등 활용), 학습 및 테스트" },
  { title: "발표자/디자이너", desc: "결과물 시각화, 포스터 제작, 발표 대본 작성" },
];