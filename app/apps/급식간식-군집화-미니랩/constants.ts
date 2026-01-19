import { Snack, ConceptCardData, QuizQuestion } from './types';

export const INITIAL_SNACKS: Snack[] = [
  { id: 's1', name: '초코우유', servingSize: 200, kcal: 130 },
  { id: 's2', name: '바나나우유', servingSize: 240, kcal: 210 },
  { id: 's3', name: '단팥빵', servingSize: 100, kcal: 280 },
  { id: 's4', name: '소보로빵', servingSize: 90, kcal: 310 },
  { id: 's5', name: '사과', servingSize: 200, kcal: 114 },
  { id: 's6', name: '바나나', servingSize: 100, kcal: 93 },
  { id: 's7', name: '컵라면(소)', servingSize: 65, kcal: 290 },
  { id: 's8', name: '삼각김밥', servingSize: 110, kcal: 180 },
  { id: 's9', name: '에너지바', servingSize: 40, kcal: 190 },
  { id: 's10', name: '아몬드(한줌)', servingSize: 30, kcal: 180 },
  { id: 's11', name: '요구르트', servingSize: 65, kcal: 50 },
  { id: 's12', name: '감자칩', servingSize: 60, kcal: 330 },
  { id: 's13', name: '젤리', servingSize: 50, kcal: 175 },
  { id: 's14', name: '삶은달걀', servingSize: 50, kcal: 75 },
  { id: 's15', name: '닭가슴살소시지', servingSize: 70, kcal: 95 },
];

export const CONCEPTS: ConceptCardData[] = [
  {
    id: 'c1',
    title: '비지도학습 (Unsupervised Learning)',
    definition: '정답(레이블)이 없는 데이터에서 숨겨진 패턴이나 구조를 스스로 찾아내는 학습 방법입니다.',
    keywords: ['정답 없음', '패턴 발견', '데이터 탐색'],
    example: '구매 이력만 보고 비슷한 쇼핑 성향을 가진 고객들을 그룹으로 묶기.',
    misconception: '오해: 비지도학습은 아무것도 안 가르쳐줘서 성능이 나쁘다? → 교정: 정답을 모를 때 유용하며, 새로운 통찰을 줍니다.',
    quiz: {
      question: '다음 중 비지도학습의 예시는?',
      options: ['개 고양이 사진 분류하기(정답 있음)', '비슷한 뉴스 기사끼리 그룹 짓기', '공부 시간으로 시험 점수 예측하기'],
      correctIndex: 1,
    },
  },
  {
    id: 'c2',
    title: '군집화 (Clustering)',
    definition: '데이터들을 비슷한 특성을 가진 것끼리 여러 그룹(Cluster)으로 묶는 작업입니다.',
    keywords: ['끼리끼리', '유사성', '그룹핑'],
    example: '우리 반 친구들을 "키와 몸무게"가 비슷한 그룹으로 나누기.',
    misconception: '오해: 군집화는 분류(Classification)와 같다? → 교정: 분류는 정해진 반(A반, B반)에 넣는 것이고, 군집화는 반 자체를 새로 만드는 것입니다.',
    quiz: {
      question: '군집화의 핵심 목표는?',
      options: ['데이터를 순서대로 나열하기', '비슷한 데이터끼리 모으기', '미래의 값을 예측하기'],
      correctIndex: 1,
    },
  },
  {
    id: 'c3',
    title: 'K-평균 (K-Means)',
    definition: '데이터를 K개의 중심점(Centroid)을 기준으로 가장 가까운 그룹에 할당하며 묶는 알고리즘입니다.',
    keywords: ['중심점', '거리 기반', '반복 계산'],
    example: '운동장에 깃발 3개(K=3)를 꽂고, 학생들에게 가장 가까운 깃발로 모이라고 하는 것.',
    misconception: '오해: K값은 컴퓨터가 알아서 정해준다? → 교정: K는 사람이 미리 지정해줘야 하는 하이퍼파라미터입니다.',
    quiz: {
      question: 'K-Means에서 K가 의미하는 것은?',
      options: ['데이터의 전체 개수', '만들고 싶은 그룹의 개수', '반복 횟수'],
      correctIndex: 1,
    },
  },
  {
    id: 'c4',
    title: '거리 (Distance)',
    definition: '데이터 간의 유사도를 측정하는 척도입니다. 거리가 가까울수록 비슷하다고 봅니다.',
    keywords: ['유클리디안', '맨해튼', '유사도'],
    example: '직선 거리(유클리디안) vs 도로 따라 가는 거리(맨해튼).',
    misconception: '오해: 거리는 항상 물리적 거리만 의미한다? → 교정: 취향 차이, 색상 차이 등 추상적인 개념도 숫자로 표현되면 거리가 됩니다.',
    quiz: {
      question: '두 점 사이의 가장 짧은 직선 거리를 구하는 방식은?',
      options: ['유클리디안 거리', '맨해튼 거리', '코사인 유사도'],
      correctIndex: 0,
    },
  },
  {
    id: 'c5',
    title: 'K 선택의 의미',
    definition: '적절한 K를 고르는 것은 분석 결과의 해석에 큰 영향을 줍니다.',
    keywords: ['해석 가능성', '엘보우 기법', '주관적 판단'],
    example: '티셔츠 사이즈를 S, M, L 3개(K=3)로 할지, XS~XXL 6개(K=6)로 할지 결정하기.',
    misconception: '오해: K가 클수록 항상 좋다? → 교정: 너무 잘게 쪼개면 그룹의 특징을 설명하기 어려워집니다(과적합).',
    quiz: {
      question: 'K를 너무 크게 설정했을 때 발생할 수 있는 문제는?',
      options: ['계산 속도가 너무 빨라짐', '그룹의 특징이 모호해짐', '데이터가 사라짐'],
      correctIndex: 1,
    },
  },
  {
    id: 'c6',
    title: 'DBSCAN (참고)',
    definition: '밀도가 높은 부분을 연결하여 군집을 만드는 방식으로, K를 정하지 않아도 됩니다.',
    keywords: ['밀도 기반', 'K 불필요', '노이즈 제거'],
    example: '사람들이 붐비는 번화가 구역 찾기(외딴 집은 제외).',
    misconception: '오해: 모든 군집화는 K-Means만 쓴다? → 교정: 데이터 모양이 둥글지 않거나 노이즈가 많으면 DBSCAN이 더 좋을 수 있습니다.',
    quiz: {
      question: 'DBSCAN의 가장 큰 특징은?',
      options: ['중심점을 사용한다', '미리 그룹 개수를 정할 필요가 없다', '직선 거리만 사용한다'],
      correctIndex: 1,
    },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Easy
  { id: 'q1', difficulty: 'easy', question: '비지도학습에서 데이터에는 ( )이/가 없다.', options: ['정답(레이블)', '숫자', '특징'], correctIndex: 0, explanation: '비지도학습은 정답을 모르는 상태에서 패턴을 찾습니다.' },
  { id: 'q2', difficulty: 'easy', question: '비슷한 간식끼리 묶는 과정을 무엇이라 하는가?', options: ['회귀', '군집화', '분류'], correctIndex: 1, explanation: '끼리끼리 묶는 것은 군집화(Clustering)입니다.' },
  { id: 'q3', difficulty: 'easy', question: 'K-Means 알고리즘에서 사용자가 정해줘야 하는 숫자는?', options: ['K', 'N', 'X'], correctIndex: 0, explanation: 'K는 만들고 싶은 그룹의 개수입니다.' },
  
  // Normal
  { id: 'q4', difficulty: 'normal', question: 'K-Means 알고리즘의 순서로 올바른 것은?', options: ['중심 이동 → 할당 → 종료', '할당 → 중심 이동 → 반복', '종료 → 할당 → 중심 이동'], correctIndex: 1, explanation: '가까운 중심으로 할당하고, 그들의 평균으로 중심을 이동하는 과정을 반복합니다.' },
  { id: 'q5', difficulty: 'normal', question: '다음 중 군집화의 목적이 아닌 것은?', options: ['데이터 요약', '이상치 탐지', '미래 매출 정확히 맞추기'], correctIndex: 2, explanation: '구체적인 값을 예측하는 것은 주로 회귀 분석의 영역입니다.' },
  { id: 'q6', difficulty: 'normal', question: '맨해튼 거리는 주로 어떤 경우에 유용한가?', options: ['최단 직선 거리', '격자 모양의 도로망', '원형 데이터'], correctIndex: 1, explanation: '격자(Grid) 구조에서 가로+세로 이동 거리를 잴 때 적합합니다.' },
  
  // Hard
  { id: 'q7', difficulty: 'hard', question: 'K가 너무 작으면 어떤 문제가 발생하는가?', options: ['너무 세세하게 나뉜다', '서로 다른 성격이 한 그룹에 섞인다', '계산이 오래 걸린다'], correctIndex: 1, explanation: 'K가 너무 작으면 이질적인 데이터가 억지로 같은 그룹이 되어 해석이 뭉뚱그려집니다.' },
  { id: 'q8', difficulty: 'hard', question: '초기 중심점 위치에 따라 결과가 달라질 수 있는가?', options: ['항상 같다', '달라질 수 있다', '데이터 개수에 따라 다르다'], correctIndex: 1, explanation: 'K-Means는 초기값에 민감하여 실행할 때마다 결과가 달라질 수 있습니다.' },
  { id: 'q9', difficulty: 'hard', question: '군집화 결과를 평가하는 좋은 방법은?', options: ['정답지와 비교한다', '그룹 내 응집도와 그룹 간 분리도를 본다', '데이터 개수를 센다'], correctIndex: 1, explanation: '정답이 없으므로, 같은 그룹끼리 얼마나 뭉쳐있고 다른 그룹과 얼마나 떨어져 있는지를 봅니다.' },
  { id: 'q10', difficulty: 'hard', question: 'K-Means는 어떤 모양의 군집을 잘 찾지 못하는가?', options: ['원형', '크기가 비슷한 덩어리', '길게 늘어진 초승달 모양'], correctIndex: 2, explanation: 'K-Means는 중심으로부터 거리를 기반으로 하기 때문에 오목하거나 길쭉한 모양은 잘 구분하지 못합니다.' },
];

export const BADGES = [
  { id: 'k3_master', name: 'K=3 마스터', desc: 'K를 3으로 설정하고 실험 완료' },
  { id: 'dist_explorer', name: '거리 탐험가', desc: '거리 방식을 변경해봄' },
  { id: 'data_adder', name: '데이터 요리사', desc: '내 간식 데이터 1개 이상 추가' },
  { id: 'quiz_whiz', name: '퀴즈 천재', desc: '퀴즈 100점 달성' },
  { id: 'streak_3', name: '작심삼일 극복', desc: '3일 연속 접속' },
];