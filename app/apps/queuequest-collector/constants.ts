import { QuizQuestion, TheoryCardData, Difficulty } from './types';

export const PROBLEMS = [
  { id: 'cafeteria', label: '매점 혼잡 (Cafeteria Crowds)' },
  { id: 'noise', label: '교실 소음 (Classroom Noise)' },
  { id: 'dust', label: '운동장 미세먼지 (Fine Dust)' },
  { id: 'bus', label: '통학 버스 혼잡 (Bus Crowds)' },
];

export const METRICS = [
  { id: 'waitTime', label: '대기시간 (Wait Time)', recommendedType: 'structured' },
  { id: 'visitors', label: '방문 인원 (Visitors)', recommendedType: 'structured' },
  { id: 'items', label: '구매 품목 (Items)', recommendedType: 'structured' },
  { id: 'crowdLevel', label: '혼잡도 (Crowd Level)', recommendedType: 'structured' },
  { id: 'satisfaction', label: '만족도 (Satisfaction)', recommendedType: 'structured' }, // Can be unstructured if text
];

export const METHODS = [
  { id: 'survey', label: '설문 (Survey)', icon: '📝', desc: '의견/만족도 파악에 유리' },
  { id: 'observation', label: '관찰 (Observation)', icon: '👀', desc: '실제 행동 데이터 수집' },
  { id: 'experiment', label: '실험 (Experiment)', icon: '⚗️', desc: '변수 통제 필요' },
  { id: 'sensor', label: '센서 (Sensor)', icon: '📡', desc: '자동화된 정밀 측정' },
  { id: 'shared', label: '공유 데이터 (Open Data)', icon: '📂', desc: '기존 데이터 활용' },
  { id: 'web', label: '웹 수집 (Crawling)', icon: '🌐', desc: '비활성화됨 (고급)', disabled: true },
];

export const THEORY_CARDS: TheoryCardData[] = [
  {
    id: 'struct_vs_unstruct',
    title: '정형 vs 비정형 데이터',
    definition: '데이터의 형태와 구조에 따른 구분',
    keywords: ['표(Table)', '규칙', '멀티미디어'],
    example: '엑셀 파일(정형) vs 매점 CCTV 영상(비정형)',
    misconception: '글자는 무조건 비정형이다?',
    correction: '아니요! 객관식 응답처럼 미리 정해진 값은 정형 데이터로 처리될 수 있습니다.',
    checkQuestion: '친구들의 "한 줄 구매평"은 정형일까요, 비정형일까요?',
  },
  {
    id: 'bias',
    title: '데이터 편향 (Bias)',
    definition: '데이터가 전체 대상을 공정하게 대표하지 못하는 현상',
    keywords: ['대표성', '왜곡', '특정 시간대'],
    example: '매점에 사람이 없는 수업 시간에만 조사하여 "매점은 한산하다"고 결론 내림',
    misconception: '데이터 양이 많으면 편향이 사라진다?',
    correction: '아니요! 편향된 방법으로 많이 모으면 "편향된 결과"만 더 강화됩니다.',
    checkQuestion: '점심시간 10분만 조사하면 어떤 문제가 생길까요?',
  },
  {
    id: 'ethics',
    title: '데이터 수집 윤리',
    definition: '데이터를 모으고 사용할 때 지켜야 할 도덕적 원칙',
    keywords: ['동의', '익명성', '저작권'],
    example: '설문지 상단에 "수집 목적"과 "폐기 시점"을 명시하고 동의 받기',
    misconception: '공익을 위해서라면 몰래 찍어도 된다?',
    correction: '절대 아닙니다! 초상권 침해 및 불법 수집이 될 수 있습니다.',
    checkQuestion: '친구 사진을 허락 없이 찍어서 AI 학습에 쓰면 될까요?',
  }
];

export const QUIZ_POOL: QuizQuestion[] = [
  // Easy
  {
    id: 'q1',
    difficulty: 'easy',
    type: 'multiple',
    question: '다음 중 "정형 데이터"의 예시로 가장 적절한 것은?',
    options: ['친구와 나눈 대화 녹음 파일', '엑셀에 정리된 일별 매점 매출액', '인스타그램에 올린 급식 사진', '유튜브 브이로그 영상'],
    correctAnswer: 1,
    explanation: '정형 데이터는 행과 열이 있는 표(엑셀, DB) 형태로 저장하기 쉬운 데이터입니다.',
    tags: ['struct_vs_unstruct']
  },
  {
    id: 'q2',
    difficulty: 'easy',
    type: 'multiple',
    question: '친구들의 "만족도 점수(1~5점)"를 모으려 합니다. 가장 적절한 수집 방법은?',
    options: ['센서 설치', '설문 조사', '공유 데이터 검색', '몰래 관찰'],
    correctAnswer: 1,
    explanation: '주관적인 의견이나 만족도는 직접 물어보는 "설문 조사"가 가장 적합합니다.',
    tags: ['method']
  },
  {
    id: 'q3',
    difficulty: 'easy',
    type: 'short',
    question: '데이터 수집 시 개인정보 보호를 위해 반드시 받아야 하는 것은? (두 글자)',
    correctAnswer: ['동의'],
    explanation: '정보 주체의 "동의" 없이는 개인정보를 수집할 수 없습니다.',
    tags: ['ethics']
  },
  // Medium
  {
    id: 'q4',
    difficulty: 'medium',
    type: 'multiple',
    question: '매점 대기 시간을 측정하는데 "점심시간 종이 울린 직후 5분"만 조사했습니다. 이 데이터의 문제는?',
    options: ['데이터 양이 너무 적다', '비정형 데이터라서 분석이 어렵다', '특정 시간대에 치우친 편향(Bias)이 있다', '윤리적으로 문제가 있다'],
    correctAnswer: 2,
    explanation: '가장 붐비는 시간만 조사하거나, 특정 시간만 조사하면 전체 평균을 왜곡하는 "대표성 편향"이 발생합니다.',
    tags: ['bias']
  },
  {
    id: 'q5',
    difficulty: 'medium',
    type: 'short',
    question: '표(Table) 형태로 정리할 수 없으며 텍스트, 이미지, 영상 등을 포함하는 데이터 유형은?',
    correctAnswer: ['비정형', '비정형데이터', '비정형 데이터'],
    explanation: '형태가 고정되지 않은 데이터를 "비정형 데이터"라고 합니다.',
    tags: ['struct_vs_unstruct']
  },
  // Hard
  {
    id: 'q6',
    difficulty: 'hard',
    type: 'descriptive',
    question: 'CCTV 영상으로 학생들의 동선을 분석하려 합니다. 윤리적으로 챙겨야 할 요소 2가지를 서술하세요.',
    correctAnswer: ['동의', '익명', '모자이크', '목적', '폐기'],
    explanation: '촬영 대상의 "동의"를 구해야 하며, 얼굴을 "모자이크(익명화)" 처리하거나 수집 "목적" 외 사용을 금지해야 합니다.',
    tags: ['ethics']
  }
];

export const BADGES = [
  { id: 'first_plan', name: '첫 설계자', icon: '🚀', desc: '첫 번째 수집 계획 완료' },
  { id: 'ethical_master', name: '윤리 지킴이', icon: '🛡️', desc: '윤리 체크 100% 통과' },
  { id: 'bias_breaker', name: '대표성 수호자', icon: '⚖️', desc: '편향 경고를 스스로 해결함' },
  { id: 'quiz_whiz', name: '퀴즈왕', icon: '👑', desc: '퀴즈 만점 달성' },
];