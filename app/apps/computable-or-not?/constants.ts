import { ProblemCard, QuizQuestion, QuestionType } from './types';

export const PROBLEM_CARDS: ProblemCard[] = [
  {
    id: 'p1',
    title: '공항 가는 최단 경로 찾기',
    description: '현재 위치 시청역에서 인천공항까지 지하철 환승 횟수가 가장 적은 경로를 찾고 싶다.',
    correctType: 'COMPUTABLE',
    explanation: '초기 상태(시청), 목표 상태(공항), 규칙(지하철 노선도)이 명확하여 그래프 탐색 알고리즘으로 해결 가능합니다.',
  },
  {
    id: 'p2',
    title: '오늘 저녁 메뉴 정하기',
    description: '오늘 저녁에 먹을 정말 맛있는 메뉴를 하나 정해줘.',
    correctType: 'CONDITIONAL',
    missingElements: ['취향 데이터', '제약 조건(예산, 알러지)', '목표 정의(맛있다의 기준)'],
    explanation: '‘맛있다’는 주관적입니다. 사용자 선호도 데이터와 예산 제약이 주어지면 추천 시스템 문제로 변환 가능합니다.',
  },
  {
    id: 'p3',
    title: '진정한 행복 찾기',
    description: '인간으로서 느낄 수 있는 궁극적인 행복을 찾는 방법을 알려줘.',
    correctType: 'NOT_COMPUTABLE',
    explanation: '추상적이고 철학적인 개념은 계산 가능한 상태나 알고리즘으로 정의하기 어렵습니다.',
  },
  {
    id: 'p4',
    title: '1부터 100까지 합 구하기',
    description: '1, 2, 3 ... 100까지 모두 더한 값을 구해줘.',
    correctType: 'COMPUTABLE',
    explanation: '입력과 연산 규칙이 매우 명확한 전형적인 컴퓨팅 문제입니다.',
  },
  {
    id: 'p5',
    title: '재미있는 영화 추천',
    description: '내가 주말에 볼만한 재미있는 영화를 추천해줘.',
    correctType: 'CONDITIONAL',
    missingElements: ['과거 시청 기록', '선호 장르'],
    explanation: '단순히 ‘재미있는’은 모호합니다. 넷플릭스처럼 시청 기록 데이터를 기반으로 하면 해결 가능합니다.',
  },
  {
    id: 'p6',
    title: '서울 여행 코스 짜기',
    description: '외국인 친구를 위해 3일짜리 서울 여행 코스를 짜줘.',
    correctType: 'CONDITIONAL',
    missingElements: ['방문지 후보', '이동 제약', '예산'],
    explanation: '방문할 장소 리스트와 시간/비용 제약이 구체화되면 최적화 문제(TSP 변형)로 풀 수 있습니다.',
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    text: '다음 중 "컴퓨팅 사고"에서 문제를 해결 가능한 형태로 만드는 과정을 무엇이라 하나요?',
    type: QuestionType.CLASSIFY,
    options: ['추상화(Abstraction)', '알고리즘(Algorithm)', '분해(Decomposition)', '패턴인식(Pattern Recognition)'],
    correctAnswer: '추상화(Abstraction)',
    difficulty: 'EASY'
  },
  {
    id: 'q2',
    text: '"학교에서 집까지 가장 빠른 길 찾기" 문제에서 불필요한 정보는?',
    type: QuestionType.CLASSIFY,
    options: ['신호등 위치', '도로의 길이', '보도블럭의 색깔', '제한 속도'],
    correctAnswer: '보도블럭의 색깔',
    difficulty: 'EASY'
  },
  {
    id: 'q3',
    text: '"내일 입을 옷 추천" 문제를 컴퓨팅 가능하게 만들 때 꼭 필요한 데이터가 아닌 것은?',
    type: QuestionType.CLASSIFY,
    options: ['내일 날씨(기온)', '옷장 속 의류 목록', '드레스 코드(TPO)', '옆집 강아지 이름'],
    correctAnswer: '옆집 강아지 이름',
    difficulty: 'MEDIUM'
  },
  {
    id: 'q4',
    text: '문제를 해결하기 위해 현재 상태와 목표 상태의 차이를 줄여나가는 과정을 OOOO이라고 합니다.',
    type: QuestionType.CLASSIFY,
    options: ['상태 정의', '알고리즘', '패턴 매칭', '오류 수정'],
    correctAnswer: '알고리즘',
    difficulty: 'MEDIUM'
  },
  {
    id: 'q5',
    text: '"행복해지기"가 컴퓨팅으로 풀기 어려운 가장 큰 이유는?',
    type: QuestionType.CLASSIFY,
    options: ['데이터가 너무 많아서', '목표 상태가 모호해서', '컴퓨터 성능이 부족해서', '전기가 많이 들어서'],
    correctAnswer: '목표 상태가 모호해서',
    difficulty: 'HARD'
  }
];

export const BADGES = [
  { id: 'first_refine', name: '첫 번째 재정의', description: '조건부 문제를 처음으로 해결 가능하게 바꿈' },
  { id: 'streak_3', name: '작심삼일 탈출', description: '3일 연속 접속' },
  { id: 'master_classifier', name: '판별 마스터', description: '연속으로 5문제 정답' },
];