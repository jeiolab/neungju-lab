import { Difficulty, Mission, QuizQuestion } from './types';

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 3000];

export const BADGES = {
  STREAK_7: { id: 'streak_7', name: '일주일의 약속', icon: '🔥', description: '7일 연속 미션 완료' },
  STREAK_14: { id: 'streak_14', name: '습관 형성', icon: '⚔️', description: '14일 연속 미션 완료' },
  STREAK_30: { id: 'streak_30', name: '보안 마스터', icon: '👑', description: '30일 연속 미션 완료' },
  QUIZ_ACE: { id: 'quiz_ace', name: '퀴즈 천재', icon: '🎓', description: '퀴즈 100점 달성' },
};

export const MISSIONS_POOL: Mission[] = [
  {
    id: 'm1',
    title: '앱 권한 다이어트',
    description: '스마트폰 설정 > 앱 관리에서 3개월 이상 안 쓴 앱의 "위치", "카메라" 권한을 "허용 안 함"으로 변경하세요.',
    actionType: 'CHECK',
    relatedConcept: {
      title: '최소 권한의 원칙',
      description: '서비스 이용에 꼭 필요한 정보만 제공해야 하며, 불필요한 권한은 잠재적인 보안 위협이 될 수 있습니다.',
    },
    sharingVsProtection: {
      personal: '내 위치 정보가 마케팅에 무분별하게 쓰이는 것을 방지합니다.',
      corporate: '기업은 사용자 동의 없는 정보 수집 리스크를 줄입니다.',
      national: '국민의 프라이버시권을 보장하는 사회적 신뢰가 형성됩니다.',
    },
    thinkPrompts: [
      '지도 앱이 아닌데 "항상 위치 허용"이 켜진 앱이 있었나요?',
      '편리함(자동 태그 등)과 프라이버시 중 무엇이 더 중요한가요?',
      '권한을 껐을 때 앱 사용에 불편함이 생겼다면 어떤 점인가요?',
    ],
  },
  {
    id: 'm2',
    title: '공유 폴더 점검하기',
    description: '구글 드라이브나 클라우드에서 "링크가 있는 모든 사용자에게 공유"된 파일이 있는지 확인하고 "제한됨"으로 바꾸세요.',
    actionType: 'CHECK',
    relatedConcept: {
      title: '접근 제어 (Access Control)',
      description: '정보는 인가된 사람만 볼 수 있어야 합니다. 링크 공유는 편리하지만 유출 위험이 가장 큽니다.',
    },
    sharingVsProtection: {
      personal: '개인 과제나 사진이 모르는 사람에게 노출되는 것을 막습니다.',
      corporate: '회사 기밀 유출을 방지하여 경쟁력을 유지합니다.',
      national: '중요 기술 유출을 막아 국가 안보를 지킵니다.',
    },
    thinkPrompts: [
      '과거에 공유해두고 잊어버린 파일이 있었나요?',
      '공유의 "보기 권한"과 "편집 권한"은 어떤 차이가 있을까요?',
      '팀 프로젝트가 끝난 후 공유 설정은 어떻게 해야 할까요?',
    ],
  },
  {
    id: 'm3',
    title: 'SNS 사진 배경 확인',
    description: '최근 올린 사진이나 올릴 사진의 배경에 집 주소, 학교 이름, 택배 운송장이 보이는지 확대해서 확인해보세요.',
    actionType: 'INPUT',
    relatedConcept: {
      title: 'OSINT (공개출처정보)',
      description: '사소한 정보 조각들이 모여 개인을 특정하거나 위협하는 데 사용될 수 있습니다.',
    },
    sharingVsProtection: {
      personal: '스토킹이나 보이스피싱의 표적이 되는 것을 예방합니다.',
      corporate: '사내 보안 구역 촬영 금지로 기밀을 보호합니다.',
      national: '주요 시설 위치 정보 보호로 테러 위험을 낮춥니다.',
    },
    thinkPrompts: [
      '사진 속에서 나도 모르게 노출된 텍스트가 있었나요?',
      '친구와 함께 찍은 사진을 올릴 때 친구의 동의를 구했나요?',
      '위치 태그 기능을 끄면 어떤 장단점이 있을까요?',
    ],
  },
  {
    id: 'm4',
    title: '출처 불분명 링크 식별',
    description: '문자나 메일함에서 "무료 쿠폰", "택배 반송" 문구가 포함된 메시지를 찾아보고 링크(URL)가 공식 주소인지 확인하세요.',
    actionType: 'QUIZ',
    relatedConcept: {
      title: '피싱(Phishing) 예방',
      description: '사회공학적 기법으로 사람의 심리를 이용해 정보를 탈취하는 공격을 식별해야 합니다.',
    },
    sharingVsProtection: {
      personal: '금전적 피해와 계정 탈취를 막습니다.',
      corporate: '랜섬웨어 감염 경로를 차단하여 업무 마비를 막습니다.',
      national: '사이버 범죄 조직의 자금줄을 차단하는 효과가 있습니다.',
    },
    thinkPrompts: [
      'bit.ly 같은 단축 URL은 왜 위험할까요?',
      '친구가 보낸 링크라도 의심해봐야 하는 이유는 무엇인가요?',
      '공식 앱을 통해서만 확인하는 습관은 왜 중요할까요?',
    ],
  },
];

export const QUIZ_POOL: QuizQuestion[] = [
  {
    id: 1,
    question: '다음 중 "정보 공유"의 사회적 가치에 해당하는 것은?',
    options: ['개인 사생활 침해', '재난 상황 시 빠른 대피 정보 전파', '스팸 메일 발송', '비밀번호 공유'],
    correctAnswer: 1,
    explanation: '정보 공유는 재난, 교통, 공중보건 등 공익적 목적에서 큰 가치를 발휘합니다.',
    difficulty: Difficulty.EASY,
    conceptTag: '공유의가치',
  },
  {
    id: 2,
    question: '친구의 사진을 SNS에 올릴 때 가장 올바른 행동은?',
    options: ['얼굴을 가리고 올린다', '재미있게 편집해서 올린다', '친구에게 먼저 허락을 구한다', '아무 말 없이 올린다'],
    correctAnswer: 2,
    explanation: '초상권 보호를 위해 당사자의 동의(정보 주체의 동의)가 필수적입니다.',
    difficulty: Difficulty.EASY,
    conceptTag: '개인정보보호',
  },
  {
    id: 3,
    question: '공유 폴더 설정 중 보안상 가장 위험한 것은?',
    options: ['특정 이메일 사용자만 보기', '링크가 있는 모든 사용자에게 편집 권한 부여', '비밀번호가 걸린 링크 공유', '기간 만료 설정'],
    correctAnswer: 1,
    explanation: '링크만 있으면 누구나 들어와서 파일을 삭제하거나 변조할 수 있어 매우 위험합니다.',
    difficulty: Difficulty.MEDIUM,
    conceptTag: '접근제어',
  },
  {
    id: 4,
    question: '다음 중 개인정보에 해당하지 않는 것은?',
    options: ['주민등록번호', '홍길동의 지문 정보', '오늘 날씨 데이터', '학교와 학번이 포함된 학생증'],
    correctAnswer: 2,
    explanation: '날씨 데이터는 특정 개인을 식별할 수 없는 비개인정보(공공데이터)입니다.',
    difficulty: Difficulty.MEDIUM,
    conceptTag: '개인정보개념',
  },
  {
    id: 5,
    question: '2단계 인증(2FA)을 설정해야 하는 가장 큰 이유는?',
    options: ['로그인을 빨리 하기 위해서', '비밀번호가 유출되어도 계정을 보호하기 위해서', '비밀번호를 기억하기 싫어서', '멋있어 보여서'],
    correctAnswer: 1,
    explanation: '지식 기반(비번) 외에 소유 기반(폰) 인증을 추가하여 보안성을 비약적으로 높입니다.',
    difficulty: Difficulty.HARD,
    conceptTag: '계정보안',
  },
];
