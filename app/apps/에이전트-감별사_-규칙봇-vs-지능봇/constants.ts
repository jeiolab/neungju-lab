import { SituationCard, QuizQuestion, Misconception, ReasoningTag } from './types';

export const REASONING_TAG_LABELS: Record<ReasoningTag, string> = {
  PERCEPTION: '인식(센서)',
  LEARNING: '학습(데이터)',
  REASONING: '추론(판단)',
  ACTION: '행동(액추에이터)',
  AUTONOMY: '자율성',
  COOPERATION: '협력',
  GOAL: '목표 지향',
};

export const SITUATION_CARDS: SituationCard[] = [
  {
    id: 's1',
    title: '자동 출석 게이트',
    description: '학생이 카드를 찍으면 단순히 "삑" 소리를 내고 문을 열어준다. 카드가 없으면 열리지 않는다.',
    correctType: 'GENERAL',
    correctReasoning: ['PERCEPTION', 'ACTION'],
    explanation: '입력(카드 태깅)에 대해 미리 정의된 규칙(문 열기)만 수행하며, 스스로 학습하거나 복잡한 판단을 하지 않습니다.',
  },
  {
    id: 's2',
    title: 'AI 급식 추천 봇',
    description: '지난달 학생들이 많이 남긴 잔반 데이터를 분석하여, 이번 주 학생들이 가장 좋아할 만한 식단을 영양사에게 추천한다.',
    correctType: 'INTELLIGENT',
    correctReasoning: ['LEARNING', 'REASONING', 'GOAL'],
    explanation: '과거 데이터(잔반)를 학습하고 분석(추론)하여 "잔반 줄이기/만족도 높이기"라는 목표를 달성하려 합니다.',
  },
  {
    id: 's3',
    title: '장애물 회피 로봇청소기 (구형)',
    description: '앞으로 가다가 벽에 닿으면 범퍼가 눌리고, 무조건 오른쪽으로 90도 회전한다.',
    correctType: 'GENERAL',
    correctReasoning: ['PERCEPTION', 'ACTION'],
    explanation: '단순한 센서(범퍼) 입력에 대해 고정된 규칙(우회전)으로만 반응합니다.',
  },
  {
    id: 's4',
    title: '스마트 팀플 조율 봇',
    description: '팀원들의 시간표와 현재 위치, 과제 마감일을 고려하여 모두가 참석 가능한 최적의 회의 시간을 제안하고 예약한다.',
    correctType: 'INTELLIGENT',
    correctReasoning: ['REASONING', 'COOPERATION', 'GOAL'],
    explanation: '복잡한 변수(시간표, 위치)를 종합적으로 판단(추론)하고 팀원 간의 협력을 돕는 목표 지향적 행동을 합니다.',
  },
  {
    id: 's5',
    title: '자동 온도 조절기',
    description: '실내 온도가 24도보다 낮아지면 난방을 켜고, 26도보다 높아지면 끈다.',
    correctType: 'GENERAL',
    correctReasoning: ['PERCEPTION', 'ACTION'],
    explanation: '단순한 조건문(IF 온도 < 24 THEN 난방 ON)에 따라 동작하는 규칙 기반 에이전트입니다.',
  },
  {
    id: 's6',
    title: '자율주행 배달 로봇',
    description: '사람이 많은 길에서는 속도를 줄이고, 공사 중인 길을 발견하면 스스로 우회 경로를 생성하여 배달한다.',
    correctType: 'INTELLIGENT',
    correctReasoning: ['PERCEPTION', 'REASONING', 'AUTONOMY', 'GOAL'],
    explanation: '환경을 인식하고 상황에 따라 스스로 경로를 수정(자율, 추론)하며 배달 완료라는 목표를 가집니다.',
  },
    {
    id: 's7',
    title: '유튜브 알고리즘',
    description: '사용자가 평소에 끝까지 시청한 영상들의 패턴을 찾아내어, 사용자가 흥미를 느낄만한 새로운 영상을 홈 화면에 띄운다.',
    correctType: 'INTELLIGENT',
    correctReasoning: ['LEARNING', 'REASONING', 'GOAL'],
    explanation: '사용자의 시청 기록을 학습 데이터로 삼아 선호도를 추론하고, 시청 시간 증대라는 목표를 가집니다.',
  },
  {
    id: 's8',
    title: '현관 센서등',
    description: '어두운 밤에 사람의 움직임이 감지되면 불을 켜고, 30초 뒤에 자동으로 끈다.',
    correctType: 'GENERAL',
    correctReasoning: ['PERCEPTION', 'ACTION'],
    explanation: '조도 센서와 모션 센서의 입력값에 따라 정해진 규칙대로만 작동합니다.',
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "일반 에이전트(단순 반사 에이전트)의 가장 큰 특징은?",
    options: ["과거 데이터를 학습한다.", "복잡한 추론 과정을 거친다.", "미리 정의된 규칙(Rule)에 따라 즉각 반응한다.", "스스로 목표를 수정한다."],
    correctIndex: 2,
    explanation: "일반 에이전트는 'If-Then' 형태의 조건-행동 규칙에 따라 입력에 즉각적으로 반응합니다."
  },
  {
    id: 2,
    question: "다음 중 지능 에이전트의 핵심 요소가 아닌 것은?",
    options: ["학습 (Learning)", "추론 (Reasoning)", "단순 반복 (Simple Repetition)", "자율성 (Autonomy)"],
    correctIndex: 2,
    explanation: "단순 반복은 일반 기계나 규칙 기반 에이전트의 특징이며, 지능 에이전트는 상황에 따라 유연하게 대처합니다."
  },
  {
    id: 3,
    question: "'자율성(Autonomy)'이란 무엇을 의미하나요?",
    options: ["전원을 스스로 켜고 끄는 것", "외부의 직접적인 간섭 없이 스스로 판단하여 행동하는 것", "인터넷에 항상 연결되어 있는 것", "모든 명령을 거부하는 것"],
    correctIndex: 1,
    explanation: "자율성은 인간의 지속적인 개입 없이도 자신의 경험과 인식을 바탕으로 작동하는 능력을 말합니다."
  }
];

export const MISCONCEPTIONS: Misconception[] = [
  {
    id: 'm1',
    title: "센서가 많으면 지능형?",
    description: "센서가 수십 개 달려 있어도, 입력에 대한 반응이 고정되어 있다면 지능형이 아닙니다.",
    correction: "센서의 개수가 아니라, 데이터를 통해 '학습'하거나 상황을 '판단'하는지가 중요합니다."
  },
  {
    id: 'm2',
    title: "복잡하면 지능형?",
    description: "아무리 복잡한 계산을 하더라도, 정해진 공식만 따른다면 규칙 기반입니다.",
    correction: "지능형 에이전트는 새로운 상황이나 데이터에 적응하여 성능을 개선할 수 있어야 합니다."
  },
  {
    id: 'm3',
    title: "인터넷 연결 = 지능?",
    description: "IoT 기기가 인터넷에 연결되어 원격 제어가 된다고 해서 모두 지능형은 아닙니다.",
    correction: "연결성보다는 스스로 의사결정을 내릴 수 있는 '자율성'과 '목표 지향성'이 핵심입니다."
  }
];

export const BINGO_ITEMS = [
  "유튜브 추천 영상 클릭",
  "스마트폰 얼굴 인식 잠금해제",
  "자동 번역기 사용",
  "날씨 앱 알림 받기",
  "AI 스피커와 대화",
  "로봇 청소기 구경",
  "게임 속 NPC와 대결",
  "검색 엔진 자동완성",
  "쇼핑몰 상품 추천"
];