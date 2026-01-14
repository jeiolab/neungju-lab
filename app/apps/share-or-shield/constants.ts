import { ClassificationType, DataCard, Achievement } from './types';

export const INITIAL_CARDS: DataCard[] = [
  {
    id: 'c1',
    title: '친구의 주민등록번호',
    description: '친구 생일 파티 초대장에 적힌 주민번호',
    type: ClassificationType.SHIELD,
    explanation: '주민등록번호는 고유식별정보로, 법적 근거 없이는 수집 및 공유가 불가능합니다.',
    difficulty: 1,
  },
  {
    id: 'c2',
    title: '오늘의 미세먼지 농도',
    description: '기상청에서 발표한 우리 동네 대기질',
    type: ClassificationType.SHARE,
    explanation: '공공기관이 생성한 공공데이터로, 국민의 건강을 위해 널리 공유되어야 합니다.',
    difficulty: 1,
  },
  {
    id: 'c3',
    title: '나의 현관 비밀번호',
    description: '기억하기 쉬운 1234 비밀번호',
    type: ClassificationType.SHIELD,
    explanation: '비밀번호는 개인의 자산과 안전을 지키는 핵심 정보로 절대 공유해선 안 됩니다.',
    difficulty: 1,
  },
  {
    id: 'c4',
    title: '시내버스 도착 정보',
    description: '실시간 버스 위치 및 도착 예정 시간',
    type: ClassificationType.SHARE,
    explanation: '교통 편의를 위한 공공데이터입니다.',
    difficulty: 1,
  },
  {
    id: 'c5',
    title: '저작권 있는 최신 영화',
    description: '극장에서 상영 중인 영화 파일',
    type: ClassificationType.SHIELD,
    explanation: '저작권법에 의해 보호받는 저작물입니다. 무단 공유는 불법입니다.',
    difficulty: 2,
  },
  {
    id: 'c6',
    title: 'CCL(BY) 적용 사진',
    description: '저작자 표시(BY) 조건이 붙은 무료 이미지',
    type: ClassificationType.SHARE,
    explanation: 'CCL(Creative Commons License) 조건을 지키면 공유가 가능합니다.',
    difficulty: 2,
  },
  {
    id: 'c7',
    title: '병원 진료 기록',
    description: '최근 다녀온 병원 처방전과 병명',
    type: ClassificationType.SHIELD,
    explanation: '민감정보에 해당하는 의료 기록은 매우 엄격하게 보호되어야 합니다.',
    difficulty: 1,
  },
  {
    id: 'c8',
    title: '우리 학교 급식 메뉴',
    description: '이번 주 점심 식단표',
    type: ClassificationType.SHARE,
    explanation: '학교 구성원의 알 권리를 위한 정보로 공개 및 공유가 권장됩니다.',
    difficulty: 1,
  },
  {
    id: 'c9',
    title: '친구의 비밀 일기장',
    description: '우연히 보게 된 친구의 속마음',
    type: ClassificationType.SHIELD,
    explanation: '사생활의 비밀과 자유를 침해하는 행위입니다.',
    difficulty: 1,
  },
  {
    id: 'c10',
    title: '국립공원 등산로 지도',
    description: '안전한 산행을 위한 지도 데이터',
    type: ClassificationType.SHARE,
    explanation: '국민의 안전과 여가를 위한 공공데이터입니다.',
    difficulty: 1,
  },
   {
    id: 'c11',
    title: '여권 번호',
    description: '여행 사진에 우연히 찍힌 여권 하단',
    type: ClassificationType.SHIELD,
    explanation: '여권 번호는 개인 식별 정보로 도용 위험이 큽니다.',
    difficulty: 2,
  },
  {
    id: 'c12',
    title: '지하철 지연 증명서',
    description: '지하철 고장으로 인한 지연 공식 문서',
    type: ClassificationType.SHARE,
    explanation: '학교나 회사 제출용으로 공개적으로 발급되는 문서입니다.',
    difficulty: 2,
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: '신입 보안 요원',
    description: '첫 번째 분류 성공',
    unlocked: false,
    icon: 'fa-user-shield'
  },
  {
    id: 'a2',
    title: '공유의 미학',
    description: 'SHARE 정보 5회 연속 정답',
    unlocked: false,
    icon: 'fa-share-nodes'
  },
  {
    id: 'a3',
    title: '철통 보안',
    description: 'SHIELD 정보 5회 연속 정답',
    unlocked: false,
    icon: 'fa-lock'
  },
  {
    id: 'a4',
    title: '전설의 데이터 센터',
    description: '랭킹 모드에서 1000점 달성',
    unlocked: false,
    icon: 'fa-server'
  }
];
