import { TheoryCard, QuizQuestion } from './types';

export const THEORY_CARDS: TheoryCard[] = [
  {
    id: 'concept_hacking',
    title: '계정 해킹이란?',
    category: 'Hacking',
    content: '타인이 내 SNS나 게임 계정에 무단 침입하는 행위입니다. 주로 쉬운 비밀번호 사용, 공용 PC 로그인 유지, 피싱 사이트 접속 등이 원인입니다.',
    checkQuestion: '비밀번호를 "123456"으로 설정하면 해킹 위험이 낮다?',
    checkAnswer: false
  },
  {
    id: 'concept_smishing',
    title: '스미싱(Smishing)',
    category: 'Smishing',
    content: '문자메시지(SMS)와 피싱(Phishing)의 합성어. "택배 주소지 변경", "무료 쿠폰" 등의 문구와 함께 악성 URL 클릭을 유도합니다.',
    checkQuestion: '출처가 불분명한 URL은 절대 클릭하지 말아야 한다?',
    checkAnswer: true
  },
  {
    id: 'concept_2fa',
    title: '2단계 인증(2FA)',
    category: 'Auth',
    content: '아이디/비번 외에 스마트폰 인증, OTP 등 추가 인증을 거치는 보안 방식입니다. 비번이 털려도 계정을 지킬 수 있는 가장 강력한 방패입니다.',
    checkQuestion: '2단계 인증을 켜면 로그인이 조금 번거로워도 보안은 훨씬 강력해진다?',
    checkAnswer: true
  },
  {
    id: 'concept_autologin',
    title: '자동 로그인 & 클라우드',
    category: 'Auth',
    content: 'PC방이나 학교 공용 컴퓨터에서 "로그인 상태 유지"를 체크하면, 다음 사람이 내 계정을 그대로 볼 수 있습니다. 반드시 해제하고 로그아웃해야 합니다.',
    checkQuestion: 'PC방에서는 브라우저를 끄기만 해도 안전하게 로그아웃 된다?',
    checkAnswer: false
  }
];

export const TIPS = [
  { context: '학교/교실', text: '친구 태블릿이나 학교 PC 빌려 쓸 땐 반드시 "시크릿 모드" 사용하기!' },
  { context: 'PC방', text: '자리에 앉자마자 키보드에 수상한 장치(키로거)가 없는지 확인, 나올 땐 반드시 "로그아웃" 버튼 클릭.' },
  { context: 'SNS', text: '프로필에 학교, 학번, 생년월일 등 개인정보 너무 많이 공개하지 않기.' },
  { context: '집/개인기기', text: '백신 앱 설치하고 실시간 감시 켜두기. OS 업데이트 미루지 않기.' }
];

export const INITIAL_QUIZZES: QuizQuestion[] = [
  {
    id: 'q_easy_1',
    difficulty: 'EASY',
    question: '다음 중 스미싱으로 의심되는 문자는?',
    options: [
      '[학교알림] 내일 준비물: 체육복',
      '[CJ택배] 주소지 불명으로 배송 불가. 주소 수정: bit.ly/XyZ123',
      '[엄마] 오늘 저녁 늦게 들어갈게',
      '[통신사] 이번 달 요금 명세서가 이메일로 발송되었습니다.'
    ],
    correctAnswer: '[CJ택배] 주소지 불명으로 배송 불가. 주소 수정: bit.ly/XyZ123',
    explanation: '단축 URL(bit.ly 등)이 포함되어 있고, 개인정보 입력을 긴급하게 유도하는 문자는 스미싱일 확률이 높습니다.'
  },
  {
    id: 'q_normal_1',
    difficulty: 'NORMAL',
    question: 'PC방에서 게임을 하다가 급하게 나왔는데 로그아웃을 안 한 것 같다. 가장 먼저 해야 할 조치는?',
    correctAnswer: '비밀번호 변경',
    explanation: '스마트폰으로 즉시 해당 사이트에 접속하여 "모든 기기에서 로그아웃" 기능을 실행하거나 비밀번호를 변경해야 합니다.'
  }
];

export const BADGES = {
  PERFECT_DEFENSE: '🛡️ 철벽 방어',
  SMISHING_HUNTER: '🎣 스미싱 사냥꾼',
  TWO_FACTOR_MASTER: '🔐 2FA 마스터',
  STREAK_3: '🔥 작심삼일 돌파'
};
