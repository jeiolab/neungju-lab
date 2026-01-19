import { QuizQuestion } from './types';

export const CONCEPTS = [
  {
    title: "비지도학습이란?",
    content: "선생님이 정답을 알려주지 않고, 스스로 공부하는 것과 비슷해요. 데이터에 '정답표(레이블)'가 없을 때, 데이터의 특징만 보고 패턴을 찾아내는 인공지능 학습 방법입니다.",
    icon: "Brain"
  },
  {
    title: "핵심 키워드",
    content: "1. 정답 없음 (No Labels)\n2. 데이터의 특성 (Features)\n3. 군집화 (Clustering - 끼리끼리 묶기)",
    icon: "Key"
  },
  {
    title: "대표 예시",
    content: "비슷한 뉴스 기사끼리 그룹으로 묶거나, 구매 성향이 비슷한 고객들을 그룹화할 때 사용해요. '이 그룹은 스포츠 뉴스네!'라고 이름을 붙이는 건 나중 일이죠.",
    icon: "Library"
  },
  {
    title: "오해하기 쉬운 점",
    content: "지도학습의 '분류(Classification)'와 헷갈리지 마세요! 분류는 '이건 사과, 이건 배'라고 미리 배운 뒤 구분하는 것이고, 비지도학습(군집화)은 '뭔지 모르겠지만 얘네 둘은 비슷하게 생겼네?' 하고 묶는 것입니다.",
    icon: "AlertTriangle"
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    difficulty: '하',
    question: "비지도학습의 가장 큰 특징은 무엇인가요?",
    options: ["정답(레이블)이 있는 데이터를 사용한다.", "정답이 없는 데이터에서 패턴을 찾는다.", "항상 100% 정확한 정답을 맞춘다.", "사람이 일일이 규칙을 알려준다."],
    correctAnswer: 1,
    explanation: "비지도학습(Unsupervised Learning)은 정답지(레이블) 없이 데이터 자체의 특성을 학습합니다.",
    hint: "시험 볼 때 답안지 없이 문제를 푸는 상황을 상상해보세요."
  },
  {
    id: 2,
    difficulty: '하',
    question: "다음 중 비지도학습의 대표적인 작업은?",
    options: ["군집화 (Clustering)", "회귀 (Regression)", "분류 (Classification)", "강화학습 (Reinforcement Learning)"],
    correctAnswer: 0,
    explanation: "군집화는 비슷한 특성을 가진 데이터끼리 묶는 비지도학습의 대표적인 예입니다. 분류와 회귀는 주로 지도학습에 속합니다.",
    hint: "비슷한 친구들끼리 모이는 것을 영어로 C로 시작하는 단어로 표현해요."
  },
  {
    id: 3,
    difficulty: '중',
    question: "쇼핑몰에서 고객들의 구매 내역을 분석해 비슷한 성향의 고객 그룹을 만들려고 합니다. 이때 적합한 학습 방법은?",
    options: ["지도학습", "비지도학습", "강화학습", "전이학습"],
    correctAnswer: 1,
    explanation: "고객 그룹에 대한 정해진 정답(예: A그룹, B그룹)이 미리 있는 것이 아니라, 데이터 특성에 따라 자연스럽게 그룹을 나누는 것이므로 비지도학습이 적합합니다.",
    hint: "고객들에게 미리 '알뜰형', '큰손형'이라는 이름표가 붙어있지 않아요."
  },
  {
    id: 4,
    difficulty: '중',
    question: "비지도학습이 '아닌' 예시는?",
    options: ["뉴스 기사 주제별 자동 그룹화", "유전자 데이터의 패턴 분석", "스팸 메일 필터링 (스팸/정상 레이블 있음)", "이상 거래 탐지"],
    correctAnswer: 2,
    explanation: "스팸 메일 필터링은 보통 '스팸이다/아니다'라는 정답(레이블)을 가지고 학습시키므로 지도학습에 해당합니다.",
    hint: "이미 '스팸'인지 '정상'인지 정답을 알려주고 학습시키는 경우를 찾아보세요."
  },
  {
    id: 5,
    difficulty: '상',
    question: "비지도학습의 결과를 평가하기 어려운 이유는?",
    options: ["데이터 양이 적어서", "계산 속도가 너무 빨라서", "비교할 실제 정답(Ground Truth)이 없어서", "컴퓨터 성능이 부족해서"],
    correctAnswer: 2,
    explanation: "비지도학습은 애초에 정답이 없는 데이터를 다루기 때문에, 모델이 묶은 그룹이 '맞다/틀리다'를 명확히 판단하기 어렵습니다. 그래서 해석이 중요합니다.",
    hint: "정답지가 없으면 채점도 하기 힘들겠죠?"
  }
];

export const THOUGHT_PROMPTS = [
  {
    id: "q1",
    question: "만약 도서관의 책 표지와 분류 기호가 모두 지워졌다면, 인공지능은 책 내용만 보고 어떻게 정리할 수 있을까요?",
    keywords: ["단어", "주제", "비슷", "내용", "묶", "그룹"]
  },
  {
    id: "q2",
    question: "마트에 진열된 과일들을 아무런 이름표 없이 정리한다면, 어떤 기준으로 묶을 수 있을까요? (창의적인 기준을 생각해보세요)",
    keywords: ["색깔", "크기", "모양", "냄새", "무게", "질감"]
  }
];
