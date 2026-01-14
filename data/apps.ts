export interface App {
  id: string
  name: string
  description: string
  badge?: 'new' | 'popular' | 'default'
  component?: React.ComponentType
  url?: string
  category?: '정보' | '인공지능기초' | '방과후' | '교사도구'
  buttonText?: string
  // 메뉴 구조 기반 분류 - menuStructure.ts에 정의된 메뉴 ID 사용
  menuId?: string // 예: 'unit-1-1', 'ai-1', 'tool-1'
}

// 여기에 구글 AI 스튜디오에서 제작한 앱들을 추가하세요
export const apps: App[] = [
  {
    id: 'test-app',
    name: '테스트 앱',
    description: '기본 틀에서 시작하는 첫 번째 테스트 앱입니다.',
    category: '정보',
    badge: 'new',
  },
]

