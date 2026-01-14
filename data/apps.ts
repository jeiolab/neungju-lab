export interface App {
  id: string
  name: string
  description: string
  badge?: 'new' | 'popular' | 'default'
  component?: React.ComponentType
  url?: string
  category?: '정보' | '인공지능기초' | '방과후' | '교사도구' | '수업도구' | '방과후학교'
  buttonText?: string
  // 메뉴 구조 기반 분류 - menuStructure.ts에 정의된 메뉴 ID 사용
  menuId?: string // 예: 'unit-1-1', 'ai-1', 'tool-1'
}

// 여기에 구글 AI 스튜디오에서 제작한 앱들을 추가하세요
export const apps: App[] = [
  {
    id: '지능형-짝꿍-배치-시스템',
    name: '지능형 짝꿍 배치 시스템',
    description: '출석 관리, 반복 방지 히스토리 추적, 다중 학급 데이터 저장 기능을 갖춘 똑똑한 학생 짝꿍 배치 도구입니다.',
    category: '수업도구',
    badge: 'new',
    buttonText: '시작하기',
  },
]

