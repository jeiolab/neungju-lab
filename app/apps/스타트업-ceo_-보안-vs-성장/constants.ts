import { GameStats, Scenario, QuizQuestion } from './types';

export const MAX_WEEKS = 10;

export const INITIAL_STATS: GameStats = {
  security: 50,
  users: 1000,
  budget: 10000, // $10k
  happiness: 70, // %
};

// Fallback scenarios in case API fails or for first turn
export const FALLBACK_SCENARIOS: Scenario[] = [
  {
    id: 'week-1-auth',
    title: '인증 시스템의 딜레마',
    description: '수석 개발자가 보고합니다: "사용자들이 로그인 과정이 너무 복잡하다고 불평하고 있습니다. 일반 유저의 2단계 인증(2FA)을 해제하면 가입률이 오를 것 같습니다."',
    type: 'dilemma',
    choices: [
      {
        id: 'A',
        text: '2단계 인증 해제 (성장 중시)',
        effect: { users: 500, security: -15, happiness: 5 },
        feedback: '사용자들은 빨라진 속도에 만족했지만, 보안 전문가들은 우려를 표합니다.'
      },
      {
        id: 'B',
        text: '전 직원 물리 보안키 의무화 (보안 중시)',
        effect: { security: 20, budget: -2000, happiness: -10, users: -200 },
        feedback: '보안은 강력해졌지만, 직원들은 불편해하고 예산이 크게 소모되었습니다.'
      },
      {
        id: 'C',
        text: '관리자/VPN 접속 시에만 2단계 인증 (균형)',
        effect: { security: 5, users: 100 },
        feedback: '합리적인 타협안입니다. 운영이 원활하게 지속됩니다.'
      }
    ]
  },
  {
    id: 'week-2-cloud',
    title: '클라우드 스토리지 권한 설정 실수',
    description: '인턴이 실수로 S3 버킷을 공개로 설정했습니다. 민감한 정보는 없지만 로그 파일이 노출되었습니다.',
    type: 'dilemma',
    choices: [
      {
        id: 'A',
        text: '조용히 닫고 넘어간다 (빠른 해결)',
        effect: { security: -5, happiness: 5 },
        feedback: '사건을 덮었습니다. 아무도 눈치채지 못했기를 바랍니다.'
      },
      {
        id: 'B',
        text: '전수 조사 및 공개 사과 (투명성)',
        effect: { security: 10, users: -100, budget: -1000 },
        feedback: '유저들은 정직함을 높이 샀지만 일부는 이탈했습니다. 보안 규정이 강화되었습니다.'
      },
      {
        id: 'C',
        text: '인턴 해고 및 엄격한 처벌 (규율)',
        effect: { security: 5, happiness: -20 },
        feedback: '팀 분위기가 얼어붙었습니다. 직원들이 실수할까 봐 두려워합니다.'
      }
    ]
  }
];

export const EDUCATIONAL_CONTENT = [
  {
    title: 'CIA 3요소 (CIA Triad)',
    content: '정보보안의 3대 핵심 요소는 기밀성(Confidentiality), 무결성(Integrity), 가용성(Availability)입니다.'
  },
  {
    title: '최소 권한의 원칙 (Least Privilege)',
    content: '사용자나 프로그램에 업무 수행에 필요한 최소한의 권한만 부여해야 한다는 보안 원칙입니다.'
  },
  {
    title: '정보 주체의 권리',
    content: '개인정보보호법/GDPR 등에 따라 사용자는 자신의 정보 열람, 정정, 삭제(잊혀질 권리) 등을 요구할 수 있습니다.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: '엄격한 비밀번호 정책을 강제할 때 발생하는 주된 트레이드오프(Trade-off)는 무엇인가요?',
    options: ['예산 증가', '사용자 편의성(UX) 저하', '인터넷 속도 저하', '서버 부하 증가'],
    correctIndex: 1,
    explanation: '보안 절차가 복잡해지면 사용자의 편의성이 떨어지는 경우가 많습니다.'
  },
  {
    id: 'q2',
    question: '"제로 트러스트(Zero Trust)" 보안 모델의 핵심 전제는?',
    options: ['내부망은 안전하다', '아무도 신뢰하지 않고 항상 검증한다', '방화벽은 필요 없다', '모든 사용자를 신뢰한다'],
    correctIndex: 1,
    explanation: '제로 트러스트는 "신뢰하지 마라, 항상 검증하라"를 원칙으로 합니다.'
  },
  {
    id: 'q3',
    question: '보안보다 성장을 무조건 우선시할 때 발생할 수 있는 장기적인 위험은?',
    options: ['마케팅 비용 과다', '데이터 유출 및 기업 평판 파괴', '직원들의 번아웃', '너무 많은 고객 유입'],
    correctIndex: 1,
    explanation: '보안 부채를 무시하면 결국 대규모 해킹 사고로 이어져 기업의 신뢰가 무너질 수 있습니다.'
  }
];
