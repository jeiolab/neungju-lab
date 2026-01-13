import { Era, Card, QuizQuestion } from './types';

export const ERAS: Era[] = [
  {
    id: 'era1',
    title: '규칙과 기호의 시대',
    period: '1950s - 1970s',
    keywords: ['규칙 기반(Rule-based)', '기호 주의', '튜링 테스트', 'ELIZA'],
    description: '인간이 모든 규칙을 직접 프로그래밍하던 시기입니다. 명확한 논리가 있는 문제만 해결 가능했습니다.',
    humanRole: '규칙 생성자 (Rule Creator)',
    techFocus: '탐색(Search)과 추론(Reasoning)',
    details: '이 시기의 AI는 "생각하는 기계"를 목표로 했지만, 실제로는 인간이 입력한 수많은 If-Then 규칙에 의존했습니다. 체스나 미로 찾기 같은 닫힌 문제에서는 성과를 보였으나, 복잡한 현실 세계의 문제를 다루기에는 유연성이 부족했습니다.'
  },
  {
    id: 'era2',
    title: '지식 기반과 암흑기',
    period: '1980s - 1990s',
    keywords: ['전문가 시스템', 'AI 암흑기', '머신러닝 태동', 'Deep Blue'],
    description: '특정 분야의 전문가 지식을 컴퓨터에 이식하려 했으나, 관리 비용과 데이터 부족으로 한계에 부딪혔습니다.',
    humanRole: '지식 관리자 (Knowledge Engineer)',
    techFocus: '지식 표현(Knowledge Representation)',
    details: '전문가 시스템이 상용화되었지만, 모든 예외 상황을 처리할 수 없었습니다. 과도한 기대에 비해 성과가 나오지 않아 자금 지원이 끊기는 "AI 암흑기"가 도래했습니다. 하지만 이 시기 후반, 데이터를 통해 학습하는 머신러닝의 기초가 다져졌습니다.'
  },
  {
    id: 'era3',
    title: '데이터와 딥러닝의 시대',
    period: '2000s - 현재',
    keywords: ['딥러닝', '빅데이터', 'AlphaGo', '생성형 AI'],
    description: '컴퓨터가 스스로 데이터에서 패턴을 학습합니다. 인간은 데이터를 제공하고 AI를 윤리적으로 감독합니다.',
    humanRole: '데이터 설계자 및 윤리적 감독관',
    techFocus: '학습(Learning)과 생성(Generation)',
    details: '인터넷의 발달로 빅데이터가 확보되고 GPU 연산 능력이 향상되면서 딥러닝이 폭발적으로 성장했습니다. 이제 AI는 규칙을 넘어 스스로 창작물을 만들어내는 생성형 AI(Generative AI) 단계로 진화했습니다.'
  }
];

export const SIMULATION_CARDS: Card[] = [
  { id: 'c1', content: 'ELIZA (심리상담 챗봇)', type: 'event', correctEra: 'era1', explanation: 'ELIZA는 1966년 개발된 초기 챗봇으로, 단순한 패턴 매칭 규칙을 사용했습니다.' },
  { id: 'c2', content: '사람이 직접 If-Then 규칙 입력', type: 'role', correctEra: 'era1', explanation: '초기 AI는 스스로 학습하지 못해 인간이 모든 논리 규칙을 코딩해야 했습니다.' },
  { id: 'c3', content: '전문가 시스템 (MYCIN)', type: 'event', correctEra: 'era2', explanation: '1970-80년대에는 특정 분야 전문가의 지식을 모방한 시스템이 유행했습니다.' },
  { id: 'c4', content: 'AI 암흑기 (자금 지원 중단)', type: 'event', correctEra: 'era2', explanation: '과도한 기대와 달리 실용적 성과가 부족해 연구 지원이 끊기는 시기였습니다.' },
  { id: 'c5', content: '알파고 (AlphaGo)', type: 'event', correctEra: 'era3', explanation: '딥러닝과 강화학습을 통해 바둑 세계 챔피언을 꺾은 획기적인 사건입니다.' },
  { id: 'c6', content: '데이터 라벨링 및 윤리 가이드라인 수립', type: 'role', correctEra: 'era3', explanation: '현대의 인간은 AI가 학습할 양질의 데이터를 선별하고, 편향성을 감시하는 역할을 합니다.' },
  { id: 'c7', content: '퍼셉트론의 한계 발견 (XOR 문제)', type: 'tech', correctEra: 'era1', explanation: '초기 신경망인 퍼셉트론이 간단한 XOR 문제도 못 푼다는 사실이 밝혀져 첫 번째 암흑기의 원인이 되었습니다.' },
  { id: 'c8', content: 'ChatGPT와 생성형 AI', type: 'tech', correctEra: 'era3', explanation: '대규모 언어 모델(LLM)을 통해 인간처럼 대화하고 창작하는 AI가 등장했습니다.' },
  { id: 'c9', content: '특징(Feature) 직접 설계', type: 'role', correctEra: 'era2', explanation: '머신러닝 초기에는 컴퓨터가 학습하기 좋게 인간이 데이터의 특징을 가공해주어야 했습니다.' },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    difficulty: 'easy',
    question: "1950-60년대 초기 AI의 주된 특징은 무엇인가요?",
    options: ["스스로 학습함", "인간이 입력한 규칙 기반", "빅데이터 활용", "감정을 느낌"],
    correctIndex: 1,
    explanation: "초기 AI는 'Symbolic AI'라고도 하며, 인간이 정해준 명확한 규칙(Rule)에 따라 작동했습니다."
  },
  {
    id: 2,
    difficulty: 'easy',
    question: "AI 역사에서 연구 자금이 끊기고 발전이 정체되었던 시기를 무엇이라 부르나요?",
    options: ["AI 르네상스", "AI 골든타임", "AI 암흑기(Winter)", "AI 혁명기"],
    correctIndex: 2,
    explanation: "기대에 비해 기술적 한계(컴퓨팅 파워 부족 등)가 드러나면서 투자가 위축된 시기를 'AI 암흑기'라고 합니다."
  },
  {
    id: 3,
    difficulty: 'medium',
    question: "현대 딥러닝(Deep Learning) 발전의 3대 요소가 아닌 것은?",
    options: ["빅데이터", "GPU(컴퓨팅 파워)", "알고리즘(CNN, RNN 등)", "수작업 규칙 입력"],
    correctIndex: 3,
    explanation: "딥러닝은 수작업 규칙 대신 데이터로부터 특징을 스스로 학습합니다."
  },
  {
    id: 4,
    difficulty: 'medium',
    question: "1980년대 전문가 시스템의 한계로 가장 적절한 것은?",
    options: ["규칙이 너무 적었다", "상식과 예외 처리가 어려웠다", "계산 속도가 너무 빨랐다", "데이터가 너무 많았다"],
    correctIndex: 1,
    explanation: "전문가 시스템은 좁은 영역에선 유능했지만, 일반적인 상식이나 예외 상황에 대처하는 능력이 부족했습니다."
  },
  {
    id: 5,
    difficulty: 'hard',
    question: "다음 중 생성형 AI(Generative AI) 시대의 인간의 역할로 가장 중요한 것은?",
    options: ["모든 연산 과정 직접 계산하기", "단순 반복 작업 수행", "프롬프트 엔지니어링 및 윤리적 통제", "컴퓨터 전원 관리"],
    correctIndex: 2,
    explanation: "AI가 결과물을 생성하는 시대에는 어떻게 지시할지(프롬프트)와 결과물이 올바른지 판단(윤리/검증)하는 능력이 중요합니다."
  }
];

export const BADGES = {
  INTRO: '신입 연구원',
  TIMELINE: '역사 탐험가',
  SIMULATION: '패턴 분석가',
  QUIZ_MASTER: '지식 마스터',
  REFLECTOR: '미래 설계자'
};
