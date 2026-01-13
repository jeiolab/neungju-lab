import { Badge, QuizQuestion } from './types';

export const LOCATIONS = {
  hallway: { label: '복도', energyWeight: 1.2, privacyWeight: 0.8 },
  classroom: { label: '교실', energyWeight: 1.0, privacyWeight: 1.0 },
  restroom: { label: '화장실', energyWeight: 0.9, privacyWeight: 2.5 },
};

export const BADGES: Badge[] = [
  { id: 'balance_master', name: '균형 설계자', description: '에너지, 편의성, 프라이버시 모두 70점 이상 달성', icon: 'Scale' },
  { id: 'energy_saver', name: '절전왕', description: '에너지 절감 점수 90점 이상 달성', icon: 'Leaf' },
  { id: 'privacy_guardian', name: '사생활 수호자', description: '프라이버시 점수 95점 이상 달성', icon: 'Shield' },
  { id: 'prolific_designer', name: '다작 설계가', description: '5개 이상의 설계안 저장', icon: 'PenTool' },
  { id: 'quiz_whiz', name: '이론 마스터', description: '퀴즈 100점 달성', icon: 'Award' },
];

export const THEORY_CARDS = [
  {
    title: 'PIR 센서의 원리',
    content: 'PIR(Passive Infrared) 센서는 적외선의 변화를 감지합니다. 사람의 몸에서 나오는 열(적외선)이 움직일 때 센서 표면의 온도 변화를 감지하여 전기 신호를 보냅니다. 가만히 있으면 감지하지 못하는 특징이 있습니다.',
    icon: 'Radio',
  },
  {
    title: '입력과 출력의 분리',
    content: 'IoT 시스템에서 센서는 "입력(Input)", 조명이나 모터는 "출력(Output)"입니다. 마이크로컨트롤러(MCU)는 입력 값을 읽고, 코딩된 로직에 따라 출력을 제어합니다. (예: 핀 D13 입력 -> 판단 -> 핀 D2 출력)',
    icon: 'Cpu',
  },
  {
    title: '거짓 양성 (False Positive)',
    content: '실제로는 사람이 없는데 센서가 있다고 착각하여 불이 켜지는 현상입니다. 민감도를 너무 높이면 바람에 흔들리는 커튼이나 지나가는 고양이에도 반응하여 에너지를 낭비하고, 화장실 같은 곳에선 프라이버시 침해 공포를 줄 수 있습니다.',
    icon: 'AlertTriangle',
  },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: 'PIR 센서가 주로 감지하는 것은 무엇인가요?',
    options: ['소리', '빛의 밝기', '적외선(열)의 변화', '초음파 반사'],
    correctAnswer: 2,
    explanation: 'PIR 센서는 대상이 방출하는 적외선(열)의 변화를 감지하여 움직임을 파악합니다.',
    difficulty: 'Easy',
    category: '센서 원리',
  },
  {
    id: 2,
    question: '스마트 조명 시스템에서 "입력 장치"에 해당하는 것은?',
    options: ['LED 전구', 'PIR 센서', '스피커', '모터'],
    correctAnswer: 1,
    explanation: '센서는 외부 환경의 정보를 받아들이는 입력 장치입니다. 나머지는 출력 장치입니다.',
    difficulty: 'Easy',
    category: '시스템 구조',
  },
  {
    id: 3,
    question: '화장실 조명 설계 시 가장 중요하게 고려해야 할 트레이드오프 요소는?',
    options: ['최대 밝기', '프라이버시와 오작동 방지', '색온도', 'IoT 통신 속도'],
    correctAnswer: 1,
    explanation: '화장실은 사적인 공간이므로 센서 오작동으로 인한 꺼짐이나, 불필요한 켜짐(프라이버시 침해 우려)을 민감하게 다뤄야 합니다.',
    difficulty: 'Medium',
    category: '트레이드오프',
  },
  {
    id: 4,
    question: '센서의 "민감도"를 너무 높였을 때 발생하는 문제점은?',
    options: ['감지 거리가 짧아진다.', '거짓 양성(오작동)이 증가하여 에너지가 낭비된다.', 'LED 수명이 늘어난다.', '프라이버시가 강화된다.'],
    correctAnswer: 1,
    explanation: '민감도가 높으면 작은 자극에도 반응하여 불필요하게 켜지는 빈도가 늘어납니다.',
    difficulty: 'Medium',
    category: '설계 변수',
  },
  {
    id: 5,
    question: '입력 핀 D13의 신호를 받아 D2 핀의 LED를 켜는 역할은 누가 하나요?',
    options: ['배터리', 'MCU (마이크로컨트롤러)', '저항', '브레드보드'],
    correctAnswer: 1,
    explanation: 'MCU는 입력 신호를 처리하여 출력 장치를 제어하는 두뇌 역할을 합니다.',
    difficulty: 'Easy',
    category: '시스템 구조',
  },
  {
    id: 6,
    question: '에너지 절약 점수를 높이기 위한 설계 방향으로 옳은 것은?',
    options: ['유지 시간을 최대로 늘린다.', '밝기를 항상 최대로 한다.', '필요한 최소한의 밝기와 유지 시간을 설정한다.', '센서를 제거하고 항상 켜둔다.'],
    correctAnswer: 2,
    explanation: '불필요한 에너지 소모를 줄이는 것이 핵심입니다.',
    difficulty: 'Easy',
    category: '에너지 효율',
  },
  {
    id: 7,
    question: '다음 중 "거짓 음성(False Negative)"의 예시는?',
    options: ['사람이 없는데 불이 켜짐', '사람이 있는데 움직임이 적어 불이 꺼짐', '낮에도 불이 켜짐', '고양이가 지나가서 불이 켜짐'],
    correctAnswer: 1,
    explanation: '거짓 음성은 있어야 할 신호를 감지하지 못하는 것입니다. 화장실에서 가만히 있다가 불이 꺼지는 난감한 상황이 예시입니다.',
    difficulty: 'Hard',
    category: '오작동 개념',
  },
  {
    id: 8,
    question: '복도 조명 설계 시 트레이드오프 전략으로 적절한 것은?',
    options: ['프라이버시를 최우선으로 한다.', '에너지 절감보다는 항상 켜져 있는 편의성을 중시한다.', '이동이 잦으므로 유지 시간은 짧게, 민감도는 적절히 높여 안전을 확보한다.', '조명을 아예 설치하지 않는다.'],
    correctAnswer: 2,
    explanation: '복도는 통과하는 공간이므로 사람이 지나간 후 빨리 꺼지도록(유지시간 단축) 하여 에너지를 아끼되, 감지는 잘 되도록 해야 합니다.',
    difficulty: 'Hard',
    category: '상황별 설계',
  },
  {
    id: 9,
    question: '디지털 신호와 아날로그 신호의 차이점 설명 중 틀린 것은?',
    options: ['PIR 센서는 주로 디지털 출력(High/Low)을 사용한다.', '디지털은 0과 1로 표현된다.', '아날로그는 연속적인 값을 가진다.', '조명의 밝기 조절은 오직 디지털 신호로만 가능하다.'],
    correctAnswer: 3,
    explanation: '조명의 밝기 조절은 PWM(펄스 폭 변조) 등을 이용해 아날로그적인 효과를 내거나 실제 아날로그 제어를 할 수 있습니다.',
    difficulty: 'Medium',
    category: '신호 처리',
  },
  {
    id: 10,
    question: '트레이드오프(Trade-off)의 올바른 의미는?',
    options: ['모든 요소를 완벽하게 만족시키는 것', '하나를 얻으면 다른 하나를 잃을 수 있는 상충 관계', '비용을 무제한으로 사용하는 것', '설계를 포기하는 것'],
    correctAnswer: 1,
    explanation: '공학 설계에서 완벽한 정답은 없으며, 상황에 맞춰 요소 간의 균형을 잡는 의사결정 과정입니다.',
    difficulty: 'Easy',
    category: '공학 기초',
  },
];
