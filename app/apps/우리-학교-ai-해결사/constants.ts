import { Problem, QuizQuestion } from './types';

export const PROBLEMS: Problem[] = [
  {
    id: 'p1',
    title: '불량 감귤 선별기',
    description: '컨베이어 벨트 위의 귤 사진을 보고 상한 귤과 정상 귤을 분류하고 싶어요.',
    category: '농업/분류',
    icon: '🍊',
    recommendedType: 'supervised',
    hint: '미리 "정상"과 "불량"이라고 꼬리표(정답)를 달아준 사진이 필요해요.'
  },
  {
    id: 'p2',
    title: '편의점 매출 분석',
    description: '우리 학교 앞 편의점에서 학생들이 같이 많이 사가는 물건 조합(예: 삼각김밥+우유)을 찾고 싶어요.',
    category: '마케팅/규칙',
    icon: '🏪',
    recommendedType: 'unsupervised',
    hint: '정해진 답은 없지만, 데이터 속에 숨어있는 "패턴"이나 "그룹"을 찾아야 해요.'
  },
  {
    id: 'p3',
    title: '게임 캐릭터 훈련',
    description: '장애물을 피하고 동전을 먹으며 달리는 게임 캐릭터가 스스로 실력을 늘리게 하고 싶어요.',
    category: '게임/제어',
    icon: '🎮',
    recommendedType: 'reinforcement',
    hint: '잘하면 점수(보상)를 주고, 못하면 감점(벌칙)을 주면서 시행착오를 겪게 해요.'
  },
  {
    id: 'p4',
    title: '급식 만족도 예측',
    description: '내일 나올 메뉴와 날씨 정보를 보고, 학생들이 급식을 얼마나 남길지(잔반량) 미리 알고 싶어요.',
    category: '생활/예측',
    icon: '🍱',
    recommendedType: 'supervised',
    hint: '과거의 메뉴와 날씨, 그리고 그때의 잔반량(정답) 데이터를 학습해야 해요.'
  },
  {
    id: 'p5',
    title: '도서관 책 추천',
    description: '학생들이 빌린 대출 기록을 바탕으로, 비슷한 취향의 학생끼리 묶어서 책을 추천해주고 싶어요.',
    category: '추천/군집',
    icon: '📚',
    recommendedType: 'unsupervised',
    hint: '누가 누구인지 정답을 알려주는 게 아니라, 독서 성향이 비슷한 "그룹"을 묶는 것이 핵심이에요.'
  }
];

export const QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 '지도학습'에 해당하는 사례는 무엇인가요?",
    options: [
      "구매 이력을 분석해 고객 그룹 나누기",
      "강아지와 고양이 사진에 이름을 붙여 학습시키기",
      "로봇 청소기가 벽에 부딪히며 길 찾기",
      "유튜브 알고리즘이 내 취향 분석하기"
    ],
    correctAnswer: 1,
    explanation: "사진(데이터)에 '강아지', '고양이'라는 정답(레이블)을 주어 학습하는 것은 지도학습입니다."
  },
  {
    id: 2,
    question: "알파고가 수많은 대국을 두며 승리하는 법을 스스로 깨우친 방식은?",
    options: [
      "지도학습",
      "비지도학습",
      "강화학습",
      "반지도학습"
    ],
    correctAnswer: 2,
    explanation: "환경과 상호작용하며 보상(승리)을 최대화하는 방식은 강화학습입니다."
  },
  {
    id: 3,
    question: "비지도학습(군집화)이 가장 유용한 상황은?",
    options: [
      "내일 날씨 예측하기",
      "스팸 메일 걸러내기",
      "손글씨 숫자 인식하기",
      "고객들의 뉴스 기사 주제별 분류하기"
    ],
    correctAnswer: 3,
    explanation: "기사의 주제가 미리 정해져 있지 않아도, 내용이 비슷한 것끼리 묶는 것은 비지도학습의 군집화입니다."
  }
];

export const THEORY_CONTENT = [
  {
    type: '지도학습 (Supervised)',
    desc: '문제집의 "정답"을 보고 공부하는 것과 같아요. 입력과 정답(레이블)을 함께 줍니다.',
    keywords: ['분류(Classification)', '회귀(Regression)', '예측'],
    examples: ['스팸 메일 필터링', '얼굴 인식', '부동산 가격 예측', '시험 점수 예측']
  },
  {
    type: '비지도학습 (Unsupervised)',
    desc: '정답 없이 데이터의 특징만 보고 스스로 규칙이나 패턴을 찾아내는 방식이에요.',
    keywords: ['군집화(Clustering)', '연관 규칙', '차원 축소'],
    examples: ['비슷한 뉴스 묶기', '쇼핑몰 고객 그룹 나누기', '이상 거래 탐지', '장바구니 분석']
  },
  {
    type: '강화학습 (Reinforcement)',
    desc: '시행착오를 겪으며 "보상"을 많이 받는 쪽으로 행동을 개선해 나가는 방식이에요.',
    keywords: ['에이전트', '환경', '보상', '상태'],
    examples: ['알파고(바둑)', '자율주행 주차', '게임 AI', '로봇 걷기 훈련']
  }
];