import { Badge } from './types';

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 5000];

export const BADGES: Badge[] = [
  {
    id: 'binary_streak_5',
    name: '스팸 탐지기',
    icon: '📧',
    description: '이진 분류(스팸) 5연승 달성',
    condition: (_, stats) => stats.binaryWinsStreak >= 5
  },
  {
    id: 'multi_master',
    name: '동아리 회장',
    icon: '👑',
    description: '동아리 분류 10회 정답',
    condition: (_, stats) => stats.multiCorrectCount >= 10
  },
  {
    id: 'quiz_whiz',
    name: '이론 마스터',
    icon: '🎓',
    description: '퀴즈 마스터리 80점 이상 달성',
    condition: (state) => Object.values(state.masteryByConcept).some(m => m >= 80)
  }
];

export const THEORY_CARDS = [
  {
    title: "분류(Classification)란?",
    content: "입력 데이터를 보고 정해진 **범주(Class)** 중 하나를 예측하는 작업입니다.",
    keywords: ["클래스(Class)", "레이블(Label)", "결정 경계"],
    example: "이메일 ➡️ [스팸 / 정상]",
    misconception: {
      wrong: "숫자를 예측하는 것도 분류인가요?",
      right: "아니요! 숫자를 예측하는 건 '회귀(Regression)'입니다. 분류는 '종류'를 맞추는 거예요.",
    },
    checkQuestion: {
      q: "내일 기온(℃)을 맞추는 것은 분류일까요?",
      a: false, // False = 회귀
      explanation: "기온은 연속적인 숫자이므로 '회귀'입니다. '덥다/춥다'로 나누면 분류가 됩니다!"
    }
  },
  {
    title: "이진 vs 다중 분류",
    content: "범주가 두 개면 **이진(Binary)**, 세 개 이상이면 **다중(Multi-class)** 분류라고 합니다.",
    keywords: ["이진(Binary)", "다중(Multi-class)", "One-vs-All"],
    example: "이진: 합격/불합격, 다중: 학점(A/B/C/D/F)",
    misconception: {
      wrong: "다중 분류는 모델을 여러 개 만드나요?",
      right: "보통 하나의 모델이 각 클래스별 확률을 계산해서 가장 높은 것을 선택합니다.",
    },
    checkQuestion: {
      q: "동아리를 IT, 밴드, 축구부 중 하나로 추천하는 것은?",
      a: true, // True = 다중분류 (맥락상 '분류'인지 묻거나 '다중'인지 묻는 것. 여기선 O/X 퀴즈용으로 간단화)
      explanation: "3개 중 하나를 고르므로 '다중 분류'가 맞습니다."
    }
  }
];

export const QUIZ_DATA = [
  {
    id: 1,
    difficulty: 'easy',
    question: "다음 중 '지도학습 - 분류' 문제인 것은?",
    options: ["주식 가격 예측", "강아지/고양이 사진 구별", "쇼핑몰 고객 군집화(이름 모름)", "내일의 정확한 강수량 예측"],
    answer: "강아지/고양이 사진 구별",
    explanation: "사진을 보고 정해진 라벨(강아지/고양이)을 맞추는 것이 전형적인 분류입니다. 가격/강수량은 회귀, 군집화는 비지도 학습입니다.",
    concept: "분류의 정의"
  },
  {
    id: 2,
    difficulty: 'normal',
    question: "스팸 메일 분류기에서 '입력(독립변수)'에 해당하지 않는 것은?",
    options: ["메일 제목의 '광고' 단어 포함 여부", "첨부파일 개수", "최종 판단 결과(스팸/정상)", "발신자 주소"],
    answer: "최종 판단 결과(스팸/정상)",
    explanation: "최종 결과는 우리가 맞워야 할 '레이블(종속변수)'입니다. 나머지는 판단의 근거가 되는 입력(특징)입니다.",
    concept: "독립/종속변수"
  },
  {
    id: 3,
    difficulty: 'hard',
    question: "k-NN 알고리즘에서 k=3일 때, 내 주변에 '스팸'이 2개, '정상'이 1개 있다면 나는 무엇으로 분류될까?",
    options: ["정상", "스팸", "판단 불가", "가장 가까운 1개만 따름"],
    answer: "스팸",
    explanation: "k-NN은 다수결을 따릅니다. 2:1로 스팸이 많으므로 스팸으로 분류됩니다.",
    concept: "k-NN 알고리즘"
  }
];

export const DAILY_MISSION_SEED = {
  description: "노이즈 20% 환경에서 스팸 분류 5연승 하기",
  targetStreak: 5,
  requiredNoise: 20
};