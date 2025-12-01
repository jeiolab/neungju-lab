export interface App {
  id: string
  name: string
  description: string
  badge?: 'new' | 'popular' | 'default'
  component?: React.ComponentType
  url?: string
  category?: '정보' | '인공지능기초' | '방과후' | '교사도구'
  buttonText?: string
}

// 여기에 구글 AI 스튜디오에서 제작한 앱들을 추가하세요
export const apps: App[] = [
  {
    id: 'digital-survival',
    name: '디지털 생존 가이드',
    description: '데이터, 배터리, 보안을 관리하며 디지털 생존을 경험하는 게임입니다. AI가 생성하는 상황에서 최선의 선택을 하세요!',
    badge: 'new',
    category: '정보',
    buttonText: '연습 시작',
  },
  {
    id: 'network-quiz-challenge',
    name: '네트워크 퀴즈 챌린지',
    description: '네트워크 지식을 테스트하는 퀴즈 게임입니다. 다양한 난이도와 문제 유형으로 네트워크 개념을 학습하세요!',
    badge: 'popular',
    category: '정보',
    buttonText: '연습 시작',
  },
  {
    id: 'missing-ip-case',
    name: '사라진 IP 주소 사건',
    description: '학교 서버가 다운됐다! 네트워크 수습반이 되어 IP, 게이트웨이, DNS 문제를 해결하고 탈출하세요.',
    badge: 'new',
    category: '정보',
    buttonText: '연습 시작',
  },
  {
    id: 'smart-pairing',
    name: '지능형 짝꿍 배치 시스템',
    description: '교사용 지능형 짝꿍 배치 시스템입니다. 학생들을 랜덤하게 짝꿍으로 배치하고, 중복을 방지하며 결석생을 관리할 수 있습니다.',
    badge: 'new',
    category: '교사도구',
    buttonText: '실행하기',
  },
  // 여기에 더 많은 앱들을 추가하세요
]

