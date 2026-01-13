import { ChartType, Mission, QuizQuestion, DataSet } from './types';

export const THEORY_DATA = [
  {
    type: ChartType.BAR,
    purpose: "비교 (Comparison)",
    desc: "항목 간의 크기나 수량을 비교할 때 가장 좋아요.",
    magicSpell: "비교의 기둥!",
    icon: "📊"
  },
  {
    type: ChartType.LINE,
    purpose: "추이/변화 (Trend)",
    desc: "시간의 흐름에 따른 데이터의 변화를 보여줄 때 강력해요.",
    magicSpell: "흐름의 물결!",
    icon: "📈"
  },
  {
    type: ChartType.PIE,
    purpose: "비중/비율 (Part-to-Whole)",
    desc: "전체에서 각 부분이 차지하는 비율을 볼 때 유용해요.",
    magicSpell: "나눔의 원!",
    icon: "🍰"
  },
  {
    type: ChartType.SCATTER,
    purpose: "관계/상관 (Relationship)",
    desc: "두 변수 사이의 상관관계를 파악할 때 사용해요.",
    magicSpell: "별들의 관계!",
    icon: "✨"
  }
];

// Mock Data Sets
const CLASS_DATA: DataSet = {
  name: "우리 반 친구들",
  description: "학생들의 키(cm)와 몸무게(kg) 데이터입니다.",
  xKey: 'height',
  yKey: 'weight',
  data: [
    { name: '민수', height: 160, weight: 55 },
    { name: '영희', height: 155, weight: 48 },
    { name: '철수', height: 170, weight: 65 },
    { name: '지민', height: 165, weight: 52 },
    { name: '동현', height: 175, weight: 70 },
    { name: '수진', height: 158, weight: 50 },
  ]
};

const SALES_DATA: DataSet = {
  name: "월별 마법 지팡이 판매량",
  description: "1월부터 6월까지의 판매량 변화입니다.",
  xKey: 'month',
  yKey: 'sales',
  data: [
    { month: '1월', sales: 120 },
    { month: '2월', sales: 150 },
    { month: '3월', sales: 180 },
    { month: '4월', sales: 130 },
    { month: '5월', sales: 200 },
    { month: '6월', sales: 250 },
  ]
};

const VOTE_DATA: DataSet = {
  name: "좋아하는 마법 동물 투표",
  description: "전체 학생 100명이 투표한 결과입니다.",
  xKey: 'name',
  yKey: 'value',
  data: [
    { name: '유니콘', value: 40 },
    { name: '드래곤', value: 30 },
    { name: '피닉스', value: 20 },
    { name: '그리핀', value: 10 },
  ]
};

const SCORE_DATA: DataSet = {
  name: "마법 과목 점수 비교",
  description: "4개 기숙사의 평균 점수입니다.",
  xKey: 'house',
  yKey: 'score',
  data: [
    { house: '그리핀', score: 85 },
    { house: '슬리데', score: 88 },
    { house: '후플', score: 82 },
    { house: '래번', score: 91 },
  ]
};

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "키와 몸무게의 비밀",
    goal: "키가 크면 몸무게도 많이 나갈까? 두 변수의 관계를 보여줘!",
    bestChart: ChartType.SCATTER,
    dataSet: CLASS_DATA,
    hint: "두 변수가 서로 어떻게 흩뿌려져 있는지 봐야 해."
  },
  {
    id: 2,
    title: "판매량의 흐름",
    goal: "지난 상반기 동안 판매량이 어떻게 변했는지 흐름을 보여줘.",
    bestChart: ChartType.LINE,
    dataSet: SALES_DATA,
    hint: "시간이 흐르면서 연결되는 선을 상상해봐."
  },
  {
    id: 3,
    title: "가장 인기 있는 동물",
    goal: "전체 투표 중 유니콘이 차지하는 비중이 얼마나 되는지 보여줘.",
    bestChart: ChartType.PIE,
    dataSet: VOTE_DATA,
    hint: "전체를 100으로 봤을 때 조각을 나눠야 해."
  },
  {
    id: 4,
    title: "기숙사 점수 대항전",
    goal: "어떤 기숙사가 점수가 가장 높은지 높낮이를 비교해줘.",
    bestChart: ChartType.BAR,
    dataSet: SCORE_DATA,
    hint: "높이를 비교하기엔 기둥 모양이 제격이지."
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "시간에 따른 기온 변화를 보여주기에 가장 적합한 그래프는?",
    options: ["막대 그래프", "원 그래프", "꺾은선 그래프", "산점도"],
    correctIndex: 2,
    explanation: "시간의 흐름(추이)을 보여줄 때는 꺾은선 그래프가 가장 직관적입니다."
  },
  {
    id: 2,
    question: "우리 반 학생들의 혈액형 비율을 보여주려고 합니다. 어떤 그래프가 좋을까요?",
    options: ["막대 그래프", "원 그래프", "꺾은선 그래프", "산점도"],
    correctIndex: 1,
    explanation: "전체에서 각 항목이 차지하는 비율(%)을 보여줄 때는 원 그래프가 적합합니다."
  },
  {
    id: 3,
    question: "여러 나라의 인구 수를 순위대로 비교하고 싶습니다.",
    options: ["막대 그래프", "원 그래프", "꺾은선 그래프", "산점도"],
    correctIndex: 0,
    explanation: "여러 항목의 크기나 양을 비교할 때는 막대 그래프가 가장 명확합니다."
  },
  {
    id: 4,
    question: "광고비 지출과 매출액 사이의 관계를 분석하고 싶을 때는?",
    options: ["막대 그래프", "원 그래프", "꺾은선 그래프", "산점도"],
    correctIndex: 3,
    explanation: "두 변수 간의 상관관계(패턴)를 볼 때는 산점도(Scatter Plot)를 사용합니다."
  },
  {
    id: 5,
    question: "막대 그래프의 Y축이 0부터 시작하지 않으면 어떤 문제가 생길까요?",
    options: ["아무 문제 없다", "차이가 과장되어 보인다", "색상이 흐려진다", "데이터가 사라진다"],
    correctIndex: 1,
    explanation: "Y축을 잘라내면(축 절단), 실제 차이보다 시각적으로 훨씬 큰 차이처럼 왜곡되어 보입니다."
  },
];
