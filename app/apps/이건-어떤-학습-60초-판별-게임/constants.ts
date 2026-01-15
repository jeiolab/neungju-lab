import { Difficulty, LearningType, Question, Badge } from './types';
import { Trophy, Brain, Target, Zap, Activity } from 'lucide-react';

export const QUESTIONS: Question[] = [
  // Supervised - Easy
  { id: 1, text: "개와 고양이 사진에 '개', '고양이' 정답표를 붙여 학습시킨다.", type: LearningType.SUPERVISED, difficulty: Difficulty.EASY, explanation: "정답(레이블)이 있는 데이터를 학습하므로 지도학습입니다." },
  { id: 2, text: "스팸 메일과 일반 메일을 구분하기 위해 이미 분류된 메일 10만 개를 보여준다.", type: LearningType.SUPERVISED, difficulty: Difficulty.EASY, explanation: "이미 '스팸'인지 아닌지 정답을 알려주었으므로 지도학습입니다." },
  { id: 3, text: "손글씨 숫자 이미지에 '이건 1이야', '이건 2야'라고 알려주며 가르친다.", type: LearningType.SUPERVISED, difficulty: Difficulty.EASY, explanation: "입력(이미지)과 정답(숫자)을 짝지어 주었으므로 지도학습입니다." },
  
  // Supervised - Normal
  { id: 4, text: "지난 10년치 아파트 가격 데이터를 보고 내년 가격을 예측한다.", type: LearningType.SUPERVISED, difficulty: Difficulty.NORMAL, explanation: "과거 데이터(정답)를 바탕으로 값을 예측(회귀)하는 지도학습입니다." },
  { id: 5, text: "영어 문장과 그에 맞는 한국어 번역문을 쌍으로 학습하여 번역기를 만든다.", type: LearningType.SUPERVISED, difficulty: Difficulty.NORMAL, explanation: "입력(영어)과 정답(한국어) 쌍이 존재하므로 지도학습입니다." },

  // Supervised - Hard
  { id: 6, text: "폐 X-ray 사진 1만 장에 의사가 '정상', '폐렴' 진단을 달아 학습시켰다.", type: LearningType.SUPERVISED, difficulty: Difficulty.HARD, explanation: "전문가가 레이블링(정답 달기)을 한 데이터를 사용하므로 지도학습입니다." },

  // Unsupervised - Easy
  { id: 11, text: "비슷한 구매 성향을 가진 고객끼리 그룹으로 묶는다. (그룹 이름은 모름)", type: LearningType.UNSUPERVISED, difficulty: Difficulty.EASY, explanation: "정답 없이 데이터의 특징만으로 그룹을 묶는(군집화) 비지도학습입니다." },
  { id: 12, text: "뉴스 기사들을 주제가 비슷한 것끼리 자동으로 모은다.", type: LearningType.UNSUPERVISED, difficulty: Difficulty.EASY, explanation: "미리 정해진 주제(정답) 없이 유사도 기반으로 모으므로 비지도학습입니다." },

  // Unsupervised - Normal
  { id: 13, text: "마트 장바구니 데이터에서 '맥주를 산 사람은 기저귀도 산다'는 규칙을 발견한다.", type: LearningType.UNSUPERVISED, difficulty: Difficulty.NORMAL, explanation: "데이터 간의 숨겨진 연관 규칙을 찾는 비지도학습입니다." },
  { id: 14, text: "섞여 있는 과일들을 색깔과 모양이 비슷한 것끼리 분류한다. (이름은 안 가르쳐줌)", type: LearningType.UNSUPERVISED, difficulty: Difficulty.NORMAL, explanation: "과일의 이름(정답) 없이 특징만으로 묶었으므로 비지도학습입니다." },

  // Unsupervised - Hard
  { id: 15, text: "이상 거래 탐지: 평소 패턴과 확연히 다른 신용카드 사용 내역을 찾아낸다.", type: LearningType.UNSUPERVISED, difficulty: Difficulty.HARD, explanation: "정상/비정상 레이블 없이 데이터 분포에서 벗어난 것을 찾는(이상치 탐지) 비지도학습입니다." },

  // Reinforcement - Easy
  { id: 21, text: "강아지에게 '앉아'를 시키고 성공하면 간식을 준다.", type: LearningType.REINFORCEMENT, difficulty: Difficulty.EASY, explanation: "행동에 대한 보상(간식)을 통해 학습하므로 강화학습입니다." },
  { id: 22, text: "게임 캐릭터가 벽에 부딪히면 점수를 깎고, 보석을 먹으면 점수를 준다.", type: LearningType.REINFORCEMENT, difficulty: Difficulty.EASY, explanation: "점수(보상)와 감점(벌칙)을 통해 행동을 수정하므로 강화학습입니다." },

  // Reinforcement - Normal
  { id: 23, text: "로봇 청소기가 가구에 부딪히지 않고 청소를 완료하면 칭찬한다.", type: LearningType.REINFORCEMENT, difficulty: Difficulty.NORMAL, explanation: "시행착오를 겪으며 보상을 최대화하는 방향으로 학습하는 강화학습입니다." },
  { id: 24, text: "알파고가 수많은 바둑 대국을 두며 승리(보상)하는 수를 찾아낸다.", type: LearningType.REINFORCEMENT, difficulty: Difficulty.NORMAL, explanation: "승리라는 결과를 위해 스스로 대국하며 전략을 수정하는 강화학습입니다." },

  // Reinforcement - Hard
  { id: 25, text: "자율주행차가 가상 환경에서 사고 없이 오래 주행할수록 높은 점수를 받는다.", type: LearningType.REINFORCEMENT, difficulty: Difficulty.HARD, explanation: "환경과 상호작용하며 보상(주행 거리)을 최대화하는 정책을 배우는 강화학습입니다." },

  // Traditional - Easy
  { id: 31, text: "시험 점수가 90점 이상이면 'A', 아니면 'B'라고 출력하는 규칙을 짰다.", type: LearningType.TRADITIONAL, difficulty: Difficulty.EASY, explanation: "사람이 명시적인 규칙(if-then)을 코딩했으므로 전통적 프로그래밍입니다." },
  { id: 32, text: "자판기에 1000원을 넣으면 콜라가 나온다고 미리 설정해두었다.", type: LearningType.TRADITIONAL, difficulty: Difficulty.EASY, explanation: "입력에 따른 출력이 미리 결정된 규칙 기반 시스템입니다." },

  // Traditional - Normal
  { id: 33, text: "지하철 노선도에서 최단 경로를 찾는 알고리즘을 짰다. (다익스트라 등)", type: LearningType.TRADITIONAL, difficulty: Difficulty.NORMAL, explanation: "데이터로 학습하는 것이 아니라, 정해진 수학적 절차대로 계산하므로 전통적 프로그래밍입니다." },
  { id: 34, text: "사용자가 입력한 검색어와 정확히 일치하는 글자를 문서에서 찾는다.", type: LearningType.TRADITIONAL, difficulty: Difficulty.NORMAL, explanation: "패턴 학습이 아닌 단순 문자열 매칭 규칙이므로 전통적 프로그래밍입니다." },

  // Traditional - Hard
  { id: 35, text: "세금 계산 프로그램: 법에 정해진 세율표 그대로 계산식을 입력했다.", type: LearningType.TRADITIONAL, difficulty: Difficulty.HARD, explanation: "데이터로부터 법칙을 발견하는 게 아니라, 이미 있는 법칙을 구현했으므로 전통적 프로그래밍입니다." },
];

export const BADGES: Badge[] = [
  {
    id: 'first_win',
    name: '첫 걸음',
    description: '게임을 1회 완료하세요.',
    icon: 'Flag',
    condition: (stats) => stats.totalGames >= 1
  },
  {
    id: 'score_100',
    name: '100점 돌파',
    description: '한 게임에서 100점 이상 획득하세요.',
    icon: 'Trophy',
    condition: (stats) => stats.highScore >= 100
  },
  {
    id: 'rl_master',
    name: '강화학습 감각',
    description: '강화학습 문제를 5번 이상 맞추세요.',
    icon: 'Zap',
    condition: (stats) => stats.mastery[LearningType.REINFORCEMENT].correct >= 5
  },
  {
    id: 'ul_radar',
    name: '비지도 레이더',
    description: '비지도학습 문제를 5번 이상 맞추세요.',
    icon: 'Activity',
    condition: (stats) => stats.mastery[LearningType.UNSUPERVISED].correct >= 5
  }
];