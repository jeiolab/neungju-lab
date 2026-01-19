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
  {
    id: 6,
    title: '개인정보 유출 위협',
    description: '외부 공격자가 성민들의 개인정보 데이터베이스에 접근하려고 시도하고 있습니다.',
    requiredDefense: SecurityType.CONFIDENTIALITY,
  },
  {
    id: 7,
    title: '재무 기록 변조',
    description: '내부자가 성의 재무 기록을 몰래 변경하여 자신의 이익을 취하려고 합니다.',
    requiredDefense: SecurityType.INTEGRITY,
  },
  {
    id: 8,
    title: '전력 공급 중단',
    description: '갑작스러운 정전으로 인해 성의 모든 시스템이 작동하지 않게 되었습니다.',
    requiredDefense: SecurityType.AVAILABILITY,
  },
  {
    id: 9,
    title: '암호화되지 않은 메시지',
    description: '중요한 군사 작전 계획이 암호화 없이 전달되고 있어 누구나 읽을 수 있는 상태입니다.',
    requiredDefense: SecurityType.CONFIDENTIALITY,
  },
  {
    id: 10,
    title: '데이터베이스 해킹',
    description: '해커가 성의 인구 통계 데이터를 무단으로 수정하여 혼란을 일으키려고 합니다.',
    requiredDefense: SecurityType.INTEGRITY,
  },
  {
    id: 11,
    title: '네트워크 과부하',
    description: '갑작스러운 대량의 요청으로 인해 성의 통신망이 마비되었습니다.',
    requiredDefense: SecurityType.AVAILABILITY,
  },
  {
    id: 12,
    title: '스피어 피싱 공격',
    description: '가짜 전령이 성주를 속여 중요한 비밀 정보를 빼내려고 합니다.',
    requiredDefense: SecurityType.CONFIDENTIALITY,
  },
  {
    id: 13,
    title: '로그 파일 조작',
    description: '침입자가 자신의 침입 흔적을 지우기 위해 보안 로그를 변조하려고 합니다.',
    requiredDefense: SecurityType.INTEGRITY,
  },
  {
    id: 14,
    title: '랜섬웨어 공격',
    description: '악성 프로그램이 성의 모든 문서를 암호화하여 접근을 차단했습니다.',
    requiredDefense: SecurityType.AVAILABILITY,
  },
  {
    id: 15,
    title: '소셜 엔지니어링',
    description: '공격자가 성의 직원을 속여 관리자 비밀번호를 알아내려고 합니다.',
    requiredDefense: SecurityType.CONFIDENTIALITY,
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
  {
    id: 6,
    question: '암호화는 주로 어떤 정보 보호 요소를 강화하는 기술인가?',
    options: ['기밀성', '무결성', '가용성', '모두'],
    answer: '기밀성',
    explanation: '암호화는 정보를 읽을 수 없게 만들어 허가되지 않은 접근을 막으므로 기밀성을 보장합니다.',
    type: 'MULTIPLE_CHOICE'
  },
  {
    id: 7,
    question: '해시 함수를 사용한 데이터 무결성 검증은 무결성을 보장한다.',
    answer: 'O',
    explanation: '해시 함수는 데이터가 변경되었는지 확인할 수 있게 해주므로 무결성 검증에 사용됩니다.',
    type: 'OX'
  },
  {
    id: 8,
    question: '랜섬웨어 공격은 주로 어떤 요소를 침해하는가?',
    options: ['기밀성', '무결성', '가용성', '기밀성과 가용성'],
    answer: '가용성',
    explanation: '랜섬웨어는 데이터 접근을 차단하여 가용성을 침해하는 공격입니다.',
    type: 'MULTIPLE_CHOICE'
  },
  {
    id: 9,
    question: '접근 제어 시스템은 기밀성과 무결성을 모두 보장한다.',
    answer: 'O',
    explanation: '접근 제어는 허가된 사용자만 접근하게 하여 기밀성을 보장하고, 무단 수정을 막아 무결성도 보장합니다.',
    type: 'OX'
  },
  {
    id: 10,
    question: '데이터 백업은 어떤 정보 보호 요소와 가장 관련이 깊은가?',
    options: ['기밀성', '무결성', '가용성', '책임 추적성'],
    answer: '가용성',
    explanation: '백업은 데이터 손실 시 복구를 가능하게 하여 서비스의 지속성을 보장하므로 가용성과 관련이 깊습니다.',
    type: 'MULTIPLE_CHOICE'
  },
  {
    id: 11,
    question: '디지털 서명은 데이터의 무결성을 보장하는 기술이다.',
    answer: 'O',
    explanation: '디지털 서명은 데이터가 변조되지 않았음을 증명하므로 무결성을 보장합니다.',
    type: 'OX'
  },
  {
    id: 12,
    question: 'SQL 인젝션 공격으로 데이터베이스의 정보가 유출되었다면 어떤 요소가 침해된 것인가?',
    options: ['기밀성', '무결성', '가용성', '기밀성과 무결성'],
    answer: '기밀성',
    explanation: 'SQL 인젝션으로 인한 정보 유출은 허가되지 않은 접근이므로 기밀성 침해입니다.',
    type: 'MULTIPLE_CHOICE'
  },
  {
    id: 13,
    question: '방화벽은 기밀성, 무결성, 가용성을 모두 보호할 수 있다.',
    answer: 'O',
    explanation: '방화벽은 네트워크 트래픽을 제어하여 기밀성(접근 차단), 무결성(악성 트래픽 차단), 가용성(DDoS 방어)을 모두 보호할 수 있습니다.',
    type: 'OX'
  },
  {
    id: 14,
    question: '2단계 인증(2FA)은 주로 어떤 요소를 강화하는가?',
    options: ['기밀성', '무결성', '가용성', '기밀성과 무결성'],
    answer: '기밀성',
    explanation: '2단계 인증은 허가된 사용자만 접근할 수 있게 하므로 기밀성을 강화합니다.',
    type: 'MULTIPLE_CHOICE'
  },
  {
    id: 15,
    question: '데이터 무결성 검사는 정기적으로 수행해야 한다.',
    answer: 'O',
    explanation: '정기적인 무결성 검사는 데이터 변조를 조기에 발견하여 보안 사고를 예방할 수 있습니다.',
    type: 'OX'
  },
  {
    id: 16,
    question: '비즈니스 연속성 계획(BCP)은 주로 어떤 요소를 보장하기 위한 것인가?',
    options: ['기밀성', '무결성', '가용성', '모두'],
    answer: '가용성',
    explanation: 'BCP는 재해나 장애 상황에서도 비즈니스가 지속될 수 있도록 하는 계획으로 가용성 보장이 목적입니다.',
    type: 'MULTIPLE_CHOICE'
  },
  {
    id: 17,
    question: '암호화된 데이터는 기밀성만 보장하고 무결성은 보장하지 않는다.',
    answer: 'O',
    explanation: '암호화는 기밀성을 보장하지만, 데이터가 변조되었는지는 확인할 수 없으므로 무결성은 별도로 보장해야 합니다.',
    type: 'OX'
  },
  {
    id: 18,
    question: '로그 파일 조작은 어떤 정보 보호 요소를 침해하는가?',
    options: ['기밀성', '무결성', '가용성', '책임 추적성'],
    answer: '무결성',
    explanation: '로그 파일을 조작하는 것은 데이터를 변조하는 것이므로 무결성을 침해합니다.',
    type: 'MULTIPLE_CHOICE'
  },
  {
    id: 19,
    question: '서버 이중화는 가용성을 높이는 기술이다.',
    answer: 'O',
    explanation: '서버 이중화는 한 서버에 장애가 발생해도 다른 서버가 서비스를 계속 제공할 수 있게 하므로 가용성을 높입니다.',
    type: 'OX'
  },
  {
    id: 20,
    question: '개인정보보호법에서 요구하는 "안전한 조치"는 CIA 3요소를 모두 포함한다.',
    answer: 'O',
    explanation: '개인정보보호법의 안전한 조치는 기밀성(접근 제어), 무결성(변조 방지), 가용성(백업)을 모두 포함합니다.',
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
