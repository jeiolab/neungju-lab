import { ChartType, Mission } from './types';

export const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: '아이스크림 취향 조사',
    clientRequest: "우리 반 친구들이 좋아하는 아이스크림 맛의 '비율'을 한눈에 알고 싶어!",
    description: "전체 30명의 학생 중 각 맛을 선택한 학생 수입니다. 전체 중 비중을 보기에 가장 좋은 그래프는 무엇일까요?",
    data: [
      { name: '초코', value: 15, color: '#3b2f2f' },
      { name: '바닐라', value: 9, color: '#f3e5ab' },
      { name: '딸기', value: 4, color: '#ffb7b2' },
      { name: '민트초코', value: 2, color: '#00f5d4' },
    ],
    correctCharts: [ChartType.PIE],
    bestChart: ChartType.PIE,
    hint: "전체(100%) 중에서 각 항목이 차지하는 '조각'을 보여주는 그래프를 찾아보세요.",
    dataContext: "students' favorite ice cream flavors"
  },
  {
    id: 'm2',
    title: '식물 키우기 관찰 일지',
    clientRequest: "지난 일주일 동안 강낭콩이 얼마나 자랐는지 '변화'를 보여주고 싶어.",
    description: "월요일부터 일요일까지 강낭콩의 키(cm) 변화 기록입니다. 시간의 흐름에 따른 추세를 보려면 어떤 그래프가 좋을까요?",
    data: [
      { name: '월', value: 2 },
      { name: '화', value: 2.5 },
      { name: '수', value: 3.2 },
      { name: '목', value: 4.5 },
      { name: '금', value: 6.0 },
      { name: '토', value: 7.8 },
      { name: '일', value: 10.2 },
    ],
    correctCharts: [ChartType.LINE],
    bestChart: ChartType.LINE,
    hint: "시간이 지나면서 값이 올라가는지 내려가는지 '흐름'을 연결해서 보여주는 그래프가 좋아요.",
    dataContext: "growth of a bean plant over a week"
  },
  {
    id: 'm3',
    title: '운동회 점수 대결',
    clientRequest: "청팀과 백팀, 홍팀의 점수 '크기'를 비교해서 누가 1등인지 딱 보여줘!",
    description: "각 팀이 획득한 최종 점수입니다. 항목 간의 높낮이(크기)를 비교하기 가장 적절한 그래프를 선택하세요.",
    data: [
      { name: '청팀', value: 850, color: '#3b82f6' },
      { name: '백팀', value: 720, color: '#9ca3af' },
      { name: '홍팀', value: 910, color: '#ef4444' },
    ],
    correctCharts: [ChartType.BAR],
    bestChart: ChartType.BAR,
    hint: "각 항목의 키(높이)를 나란히 세워서 비교하는 그래프가 적합해요.",
    dataContext: "sports day scores by team"
  },
  {
    id: 'm4',
    title: '학급 회의 키워드',
    clientRequest: "오늘 회의록에서 가장 많이 나온 '단어'가 무엇인지 강조하고 싶어.",
    description: "회의록 텍스트 분석 결과입니다. 많이 언급된 단어일수록 크게 보여주는 방식은 무엇일까요?",
    data: [
      { name: '축구', value: 45 },
      { name: '피구', value: 30 },
      { name: '시간', value: 25 },
      { name: '점심', value: 20 },
      { name: '규칙', value: 15 },
      { name: '심판', value: 10 },
      { name: '운동장', value: 8 },
    ],
    correctCharts: [ChartType.WORD_CLOUD],
    bestChart: ChartType.WORD_CLOUD,
    hint: "글자의 크기로 중요도를 표현하는 구름 모양의 시각화를 찾아보세요.",
    dataContext: "frequently mentioned words in a class meeting"
  }
];

export const CHART_INFO = {
  [ChartType.BAR]: { label: '막대 그래프', icon: 'BarChart' },
  [ChartType.LINE]: { label: '꺾은선 그래프', icon: 'LineChart' },
  [ChartType.PIE]: { label: '원 그래프', icon: 'PieChart' },
  [ChartType.WORD_CLOUD]: { label: '워드 클라우드', icon: 'Cloud' },
};
