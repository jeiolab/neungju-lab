import { TheoryCard, QuizQuestion } from './types';

export const THEORY_CARDS: TheoryCard[] = [
  {
    id: 'perception',
    title: '인식 (Perception)',
    icon: 'Eye',
    definition: '에이전트가 환경의 정보를 수집하는 단계. pH, 탁도, 수온, 용존 산소량(DO) 등의 센서로 수질 데이터를 감지합니다.',
    keywords: ['센서', 'Sensor', '입력', '데이터 수집'],
    example: 'pH 센서가 6.2를 측정하면, 이는 산성으로 판단할 수 있는 원시 데이터가 됩니다.',
    misconception: '센서가 곧 "판단"을 하는 것이 아닙니다. 센서는 숫자(데이터)만 제공합니다.',
  },
  {
    id: 'analysis',
    title: '분석 (Analysis)',
    icon: 'Brain',
    definition: '수집된 원시 데이터를 해석하고, 임계값(Threshold)과 논리 규칙(If-Then)에 따라 "상태"를 판단하는 단계.',
    keywords: ['임계값', 'Threshold', '논리', 'If-Then'],
    example: '만약 pH < 6.5 이면 상태 = 위험(DANGER)',
    misconception: '분석은 "행동"을 결정하지 않습니다. 분석은 현재 상황이 어떤지 "판단"만 합니다.',
  },
  {
    id: 'reasoning',
    title: '추론 (Reasoning)',
    icon: 'Zap',
    definition: '분석 결과를 바탕으로 어떤 행동을 할지 "결정"하는 단계. 보수적/최적화/모니터링 등 전략을 선택합니다.',
    keywords: ['의사결정', '전략', 'Decision'],
    example: '상태가 위험일 때, "즉시 차단" vs "알림만 전송" 중 선택',
    misconception: '추론은 "실제로 밸브를 닫는 것"이 아닙니다. "닫아라"라는 결정만 내립니다.',
  },
  {
    id: 'action',
    title: '행동 (Action)',
    icon: 'Activity',
    definition: '추론에서 내린 결정을 실제로 실행하는 단계. 액추에이터(모터, 밸브, 경보 등)를 통해 환경에 영향을 미칩니다.',
    keywords: ['액추에이터', 'Actuator', '출력', '실행'],
    example: '유입 밸브를 닫고, 관리자에게 SMS를 전송',
    misconception: '액추에이터는 "생각"하지 않습니다. 받은 명령대로만 동작합니다.',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '수질 관리 에이전트에서 pH 센서의 역할은?',
    options: ['물을 정화한다', 'pH 수치를 측정한다', '경보를 울린다', '밸브를 연다'],
    correctAnswer: 1,
    explanation: '센서는 환경의 데이터를 수집(인식)하는 역할만 합니다.',
  },
  {
    id: 2,
    question: '임계값(Threshold)이 6.5~8.5로 설정된 pH에서, 9.0이 측정되면?',
    options: ['정상', '위험(범위 초과)', '센서 오류', '재측정 필요'],
    correctAnswer: 1,
    explanation: '8.5를 초과했으므로 설정된 안전 범위를 벗어났습니다.',
  },
  {
    id: 3,
    question: '에이전트의 "인식-분석-추론-행동" 중, 액추에이터가 속한 단계는?',
    options: ['인식', '분석', '추론', '행동'],
    correctAnswer: 3,
    explanation: '액추에이터는 결정된 행동을 실제로 실행하는 "행동" 단계에 속합니다.',
  },
  {
    id: 4,
    question: '오탐(False Positive)이란?',
    options: ['물이 깨끗한데 경보가 울리는 것', '물이 오염됐는데 경보가 안 울리는 것', '센서가 고장난 것', '밸브가 열린 것'],
    correctAnswer: 0,
    explanation: '오탐은 실제로는 괜찮은데 위험하다고 잘못 판단하는 제1종 오류입니다.',
  },
  {
    id: 5,
    question: '미탐(False Negative)이란?',
    options: ['물이 깨끗한데 경보가 울리는 것', '물이 오염됐는데 경보가 안 울리는 것', '센서가 정상인 것', '밸브가 닫힌 것'],
    correctAnswer: 1,
    explanation: '미탐은 실제로 위험한데 괜찮다고 잘못 판단하는 제2종 오류입니다.',
  },
  {
    id: 6,
    question: '보수적 전략(Conservative)의 특징은?',
    options: ['의심되면 일단 차단', '확실할 때만 차단', '기록만 하고 행동 안 함', '사용자에게만 알림'],
    correctAnswer: 0,
    explanation: '안전을 최우선으로, 의심되는 상황에서는 차단하는 전략입니다.',
  },
  {
    id: 7,
    question: '에이전트의 "자율성(Autonomy)"이란?',
    options: ['사람이 조종한다', '스스로 판단하고 행동한다', '센서가 많다', '밸브가 자동이다'],
    correctAnswer: 1,
    explanation: '자율성은 외부의 직접적인 제어 없이 스스로 판단하고 행동하는 능력입니다.',
  },
  {
    id: 8,
    question: '수질 에이전트가 "반응성(Reactivity)"을 가진다면?',
    options: ['정해진 시간에만 작동한다', '수질 변화를 감지하고 즉시 대응한다', '사람 명령만 따른다', '기록만 한다'],
    correctAnswer: 1,
    explanation: '반응성은 환경 변화를 감지하고 이에 적절하게 반응하는 능력입니다.',
  },
];
