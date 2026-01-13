import { Knight, SecurityType, AttackScenario, QuizQuestion } from './types';

export const KNIGHTS: Knight[] = [
  {
    id: SecurityType.CONFIDENTIALITY,
    name: 'Shadow Sentinel',
    koreanName: '기밀성의 기사',
    description: '허가된 사용자만 정보에 접근할 수 있도록 지킵니다. 암호화와 접근 제어가 주무기입니다.',
    iconName: 'EyeOff',
    color: 'bg-indigo-600',
  },
  {
    id: SecurityType.INTEGRITY,
    name: 'Iron Shield',
    koreanName: '무결성의 기사',
    description: '정보가 허가 없이 위조되거나 변조되지 않도록 지킵니다. 데이터가 원래 상태 그대로임을 보증합니다.',
    iconName: 'ShieldCheck',
    color: 'bg-emerald-600',
  },
  {
    id: SecurityType.AVAILABILITY,
    name: 'Eternal Flow',
    koreanName: '가용성의 기사',
    description: '정당한 사용자가 필요할 때 언제든지 서비스를 이용할 수 있도록 지킵니다. 시스템 이중화와 백업이 특기입니다.',
    iconName: 'Activity',
    color: 'bg-blue-500',
  },
];

export const SCENARIOS: AttackScenario[] = [
  {
    id: 1,
    title: '비밀번호 유출 시도',
    description: '해커가 성주의 개인 금고(계정) 비밀번호를 훔치려 합니다! 어떤 기사를 내보내야 할까요?',
    requiredDefense: SecurityType.CONFIDENTIALITY,
  },
  {
    id: 2,
    title: '성벽 설계도 위조',
    description: '스파이가 침입하여 성벽 설계도(중요 파일)의 내용을 몰래 수정하려고 합니다.',
    requiredDefense: SecurityType.INTEGRITY,
  },
  {
    id: 3,
    title: '좀비 군단의 물량 공세 (DDoS)',
    description: '수많은 좀비(트래픽)가 성문으로 한꺼번에 몰려와 입구를 막고 있습니다. 정상적인 상인들이 들어올 수 없습니다!',
    requiredDefense: SecurityType.AVAILABILITY,
  },
  {
    id: 4,
    title: '통신 내용 도청',
    description: '전령이 보내는 비밀 서신을 중간에서 가로채서 훔쳐보려는 자가 있습니다.',
    requiredDefense: SecurityType.CONFIDENTIALITY,
  },
  {
    id: 5,
    title: '서버실 화재',
    description: '중앙 통제실(서버)에 불이 났습니다! 시스템이 멈추지 않고 계속 운영되려면 누가 필요할까요?',
    requiredDefense: SecurityType.AVAILABILITY,
  },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: '정보 보호의 3요소(CIA)에 해당하지 않는 것은?',
    options: ['기밀성 (Confidentiality)', '무결성 (Integrity)', '가용성 (Availability)', '복잡성 (Complexity)'],
    answer: '복잡성 (Complexity)',
    explanation: '정보 보호의 핵심 3요소는 기밀성, 무결성, 가용성입니다.',
    type: 'MULTIPLE_CHOICE'
  },
  {
    id: 2,
    question: '기밀성은 오직 허가된 사람만 정보에 접근할 수 있게 하는 것이다.',
    answer: 'O',
    explanation: '기밀성(Confidentiality)의 정의는 인가된 사용자만 정보 자산에 접근할 수 있는 성질입니다.',
    type: 'OX'
  },
  {
    id: 3,
    question: '해커가 웹사이트의 내용을 멋대로 "바꿔치기" 했다면 어떤 요소가 침해된 것인가?',
    options: ['기밀성', '무결성', '가용성', '책임성'],
    answer: '무결성',
    explanation: '데이터가 허가 없이 수정/변조되었으므로 무결성이 침해된 것입니다.',
    type: 'MULTIPLE_CHOICE'
  },
  {
    id: 4,
    question: 'DDoS 공격은 주로 기밀성을 침해하기 위한 공격이다.',
    answer: 'X',
    explanation: 'DDoS(분산 서비스 거부) 공격은 서비스를 마비시켜 정상적인 이용을 방해하므로 "가용성"을 침해하는 공격입니다.',
    type: 'OX'
  },
  {
    id: 5,
    question: '자연 재해나 시스템 오류에도 서비스가 멈추지 않게 백업을 하는 것은 가용성을 지키기 위함이다.',
    answer: 'O',
    explanation: '시스템이 지속적으로 정상 작동하도록 하는 것은 가용성 확보 조치입니다.',
    type: 'OX'
  },
];

export const LEARN_MORE_CONTENT = [
  {
    title: '관리적 보호 조치',
    content: '정보보호 정책 수립, 조직 구성, 인원 보안(교육, 서약서), 자산 분류 등 "사람"과 "규칙"에 관련된 조치입니다.',
    icon: 'Users'
  },
  {
    title: '물리적 보호 조치',
    content: '출입 통제 시스템, CCTV 설치, 서버실 잠금 장치, 재해 방지 시설 등 실제 "물리적 공간"을 보호하는 조치입니다.',
    icon: 'Lock'
  },
  {
    title: '기술적 보호 조치',
    content: '방화벽 설정, 암호화 기술 적용, 백신 프로그램 설치, 접근 제어 시스템 등 "시스템/소프트웨어" 수준의 조치입니다.',
    icon: 'Cpu'
  },
];
