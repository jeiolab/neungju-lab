import { ChartType, Mission, QuizQuestion } from './types';
import { 
  BarChart, LineChart, PieChart, Activity,  
  TrendingUp, PieChart as PieIcon
} from 'lucide-react';
import React from 'react';

// --- Theoretical Content ---
export const THEORY_CARDS = [
  {
    title: "막대 그래프 (Bar Chart)",
    desc: "항목 간의 크기를 비교할 때 가장 적합합니다. 데이터 간의 차이가 명확히 보입니다.",
    misconception: "시간의 흐름을 보여줄 때도 쓸 수 있지만, 추세 파악에는 꺾은선이 더 낫습니다.",
    icon: <BarChart className="w-6 h-6 text-blue-500" />
  },
  {
    title: "꺾은선 그래프 (Line Chart)",
    desc: "시간의 흐름에 따른 변화(추세)를 보여줄 때 강력합니다. 기울기로 변화 속도를 알 수 있습니다.",
    misconception: "항목 간의 단순 비교에는 적합하지 않습니다.",
    icon: <TrendingUp className="w-6 h-6 text-green-500" />
  },
  {
    title: "원 그래프 (Pie Chart)",
    desc: "전체에서 각 부분이 차지하는 비율을 보여줄 때 사용합니다.",
    misconception: "오해: 항목이 너무 많거나(5개 이상), 비율 차이가 미세하면 알아보기 힘듭니다. 항상 좋은 건 아닙니다!",
    icon: <PieIcon className="w-6 h-6 text-orange-500" />
  },
  {
    title: "산점도 (Scatter Plot)",
    desc: "두 변수 간의 관계(상관관계)를 파악할 때 사용합니다. (예: 공부시간과 성적)",
    misconception: "인과관계를 의미하지는 않습니다. 단순히 같이 변하는 경향만 보여줍니다.",
    icon: <Activity className="w-6 h-6 text-purple-500" />
  }
];

export const INTERPRETATION_TEMPLATES = [
  "전반적으로 [변수]는 시간이 지날수록 증가/감소하는 추세를 보입니다.",
  "[A 항목]이 [B 항목]보다 약 [N]배 더 높은 수치를 기록했습니다.",
  "가장 눈에 띄는 변화는 [시점]에 발생한 급격한 상승입니다.",
  "[변수 A]가 증가할수록 [변수 B]도 함께 증가하는 양의 상관관계를 보입니다.",
  "전체 중 [항목]이 과반수 이상인 [N]%를 차지하고 있습니다.",
  "[시점] 이전과 이후의 데이터 패턴이 확연히 다릅니다.",
  "다른 항목들에 비해 [항목]의 수치가 유독 낮게 나타났습니다.",
  "계절적 요인으로 인해 주기적인 변동이 관찰됩니다.",
  "예상과는 달리 [변수]와 [결과] 사이에는 뚜렷한 연관성이 보이지 않습니다.",
  "최고점과 최저점의 차이가 커서 변동성이 매우 높은 데이터입니다."
];

// --- Mission Generation Logic ---

const MOCK_DATA_POOLS = [
  {
    topic: "환경 이슈",
    title: "일주일간의 미세먼지 농도 변화",
    description: "지난주 학교 옥상에서 측정한 미세먼지(PM10) 농도 데이터입니다. 어떤 추세가 보이나요?",
    bestChart: 'line' as ChartType,
    availableCharts: ['line', 'bar', 'pie'] as ChartType[],
    keywords: ['변화', '상승', '하락', '추세', '요일'],
    data: [
      { name: '월', value: 45 }, { name: '화', value: 52 },
      { name: '수', value: 38 }, { name: '목', value: 65 },
      { name: '금', value: 80 }, { name: '토', value: 40 },
      { name: '일', value: 30 }
    ]
  },
  {
    topic: "학교 생활",
    title: "우리 반 학생들이 좋아하는 점심 메뉴",
    description: "급식 만족도 설문조사 결과입니다. 가장 인기 있는 메뉴 비율을 보여주세요.",
    bestChart: 'bar' as ChartType, // Can also be pie, but bar implies comparison of counts
    availableCharts: ['line', 'bar', 'pie'] as ChartType[],
    keywords: ['가장', '인기', '많다', '차지', '돈가스'],
    data: [
      { name: '돈가스', value: 12 }, { name: '제육', value: 8 },
      { name: '비빔밥', value: 4 }, { name: '스파게티', value: 6 },
      { name: '기타', value: 2 }
    ]
  },
  {
    topic: "진로 데이터",
    title: "수면 시간과 집중력 점수의 관계",
    description: "학생 10명의 수면 시간과 다음 날 집중력 테스트 점수입니다. 관계가 있을까요?",
    bestChart: 'scatter' as ChartType,
    availableCharts: ['line', 'bar', 'scatter'] as ChartType[],
    keywords: ['관계', '비례', '높을수록', '상관'],
    data: [
      { name: 'A', value: 4, value2: 30 }, { name: 'B', value: 5, value2: 45 },
      { name: 'C', value: 6, value2: 60 }, { name: 'D', value: 7, value2: 85 },
      { name: 'E', value: 8, value2: 90 }, { name: 'F', value: 3, value2: 20 },
      { name: 'G', value: 7.5, value2: 88 }
    ]
  },
  {
    topic: "교실 소음",
    title: "수업 시간대별 평균 소음 데시벨",
    description: "1교시부터 7교시까지 교실 소음을 측정했습니다. 언제 가장 시끄러운가요?",
    bestChart: 'bar' as ChartType,
    availableCharts: ['line', 'bar', 'pie'] as ChartType[],
    keywords: ['점심', '가장', '높다', '시끄럽다', '교시'],
    data: [
      { name: '1교시', value: 50 }, { name: '2교시', value: 55 },
      { name: '3교시', value: 52 }, { name: '4교시', value: 65 },
      { name: '5교시', value: 75 }, { name: '6교시', value: 60 },
      { name: '7교시', value: 58 }
    ]
  }
];

// Pseudo-random generator seeded by date
export const getDailyMission = (dateStr: string): Mission => {
  // Simple hash function for the date string (YYYYMMDD) to pick an index
  const num = parseInt(dateStr.replace(/-/g, ''), 10);
  const index = num % MOCK_DATA_POOLS.length;
  const template = MOCK_DATA_POOLS[index];
  
  return {
    id: `mission-${dateStr}`,
    dateStr,
    ...template
  };
};

// --- Quiz Data ---
export const QUIZ_POOL: QuizQuestion[] = [
  {
    id: 1,
    question: "시간의 흐름에 따른 '추세'를 파악하기 가장 좋은 차트는?",
    options: ["원 그래프", "꺾은선 그래프", "산점도", "레이더 차트"],
    correctIndex: 1,
    explanation: "꺾은선 그래프는 데이터의 흐름과 변화 속도(기울기)를 시각적으로 잘 보여줍니다.",
    conceptTag: "차트선택"
  },
  {
    id: 2,
    question: "원 그래프 사용 시 주의할 점이 아닌 것은?",
    options: ["합계가 100%가 되어야 한다", "항목 수가 너무 많으면 안 좋다", "시간의 변화를 보여주기 가장 좋다", "비율 비교에 적합하다"],
    correctIndex: 2,
    explanation: "원 그래프는 비율(Composition)을 보여주는 차트입니다. 시간의 변화(Trend)를 보여주기에는 적합하지 않습니다.",
    conceptTag: "오해"
  },
  {
    id: 3,
    question: "다음 중 왜곡된 시각화의 예시는?",
    options: ["Y축이 0부터 시작하는 막대 그래프", "데이터 출처를 명시한 그래프", "Y축의 범위를 임의로 잘라 과장한 그래프", "범례가 명확한 그래프"],
    correctIndex: 2,
    explanation: "축의 범위를 임의로 조절하면(Truncated Axis) 실제 차이보다 훨씬 과장되어 보일 수 있습니다.",
    conceptTag: "윤리"
  },
  {
    id: 4,
    question: "두 변수 간의 관계(상관관계)를 볼 때 가장 적절한 차트는?",
    options: ["막대 그래프", "파이 차트", "산점도(Scatter Plot)", "도넛 차트"],
    correctIndex: 2,
    explanation: "산점도는 X축과 Y축에 두 변수를 배치하여 관계를 파악하는 데 유용합니다.",
    conceptTag: "관계"
  }
];

export const REFLECTION_PROMPTS = [
  "만약 Y축의 최솟값을 0이 아닌 다른 값으로 설정했다면, 그래프의 인상이 어떻게 달라졌을까요?",
  "이 데이터에서 수집되지 않은 '숨겨진 변수'가 결과에 영향을 미쳤을 가능성은 없을까요?",
  "이 그래프를 보고 오해할 수 있는 사람이 있다면, 어떤 점 때문일까요?",
  "데이터의 제목을 더 자극적으로 바꾼다면 어떻게 될까요? 그것은 올바른 시각화일까요?"
];