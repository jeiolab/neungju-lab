/**
 * 메뉴 구조 정의
 * 각 카테고리별 메뉴 구조를 여기서 관리합니다.
 */

export interface MenuItem {
  id: string
  name: string
  description?: string
  children?: MenuItem[]
}

export interface CategoryMenu {
  category: '정보' | '인공지능기초' | '방과후' | '교사도구'
  name: string
  description?: string
  menuItems: MenuItem[]
}

/**
 * 정보 탭 - 교과서 단원별 구조
 */
export const informationMenu: CategoryMenu = {
  category: '정보',
  name: '정보',
  description: '고등학교 정보 교과서 단원별 실습 앱',
  menuItems: [
    {
      id: 'unit-1',
      name: 'I 컴퓨팅 시스템',
      children: [
        {
          id: 'unit-1-1',
          name: '1 네트워크',
          description: '네트워크의 특성, 공유, 무선 통신 기술'
        },
        {
          id: 'unit-1-2',
          name: '2 사물 인터넷 시스템',
          description: '사물 인터넷 시스템 구성과 동작, 설계'
        }
      ]
    },
    {
      id: 'unit-2',
      name: 'II 데이터',
      children: [
        {
          id: 'unit-2-1',
          name: '1 디지털 데이터의 압축과 암호화',
          description: '데이터 압축, 암호화 기법'
        },
        {
          id: 'unit-2-2',
          name: '2 빅데이터',
          description: '빅데이터 수집, 전처리, 시각화'
        }
      ]
    },
    {
      id: 'unit-3',
      name: 'III 알고리즘과 프로그래밍',
      children: [
        {
          id: 'unit-3-1',
          name: '1 알고리즘',
          description: '문제 분해, 모델링, 정렬, 탐색 알고리즘'
        },
        {
          id: 'unit-3-2',
          name: '2 프로그래밍',
          description: '변수, 자료형, 입출력, 제어구조, 객체와 클래스'
        }
      ]
    },
    {
      id: 'unit-4',
      name: 'IV 인공지능',
      children: [
        {
          id: 'unit-4-1',
          name: '1 지능 에이전트',
          description: '지능 에이전트의 개념과 특성, 인간과 AI의 역할'
        },
        {
          id: 'unit-4-2',
          name: '2 기계학습',
          description: '기계학습의 개념, 지도학습, 비지도학습, 활용'
        }
      ]
    },
    {
      id: 'unit-5',
      name: 'V 디지털 문화',
      children: [
        {
          id: 'unit-5-1',
          name: '1 디지털 기술과 사회 변화',
          description: '디지털 기술의 영향, 디지털 사회의 진로'
        },
        {
          id: 'unit-5-2',
          name: '2 정보 보호와 보안',
          description: '정보 보호와 정보 공유, 정보 보안'
        }
      ]
    }
  ]
}

/**
 * 인공지능기초 탭 메뉴 구조
 */
export const aiBasicMenu: CategoryMenu = {
  category: '인공지능기초',
  name: '인공지능기초',
  description: '고등학교 인공지능 기초 교과서 단원별 실습 앱',
  menuItems: [
    {
      id: 'ai-unit-1',
      name: 'I 인공지능의 이해',
      children: [
        {
          id: 'ai-unit-1-1',
          name: '1 인공지능의 개념과 원리',
          description: '인공지능의 개념, 발전 과정, 생활 속 인공지능'
        },
        {
          id: 'ai-unit-1-2',
          name: '2 탐색과 추론',
          description: '상태 공간과 탐색 전략, 지식 표현과 규칙 기반 추론'
        }
      ]
    },
    {
      id: 'ai-unit-2',
      name: 'II 인공지능과 학습',
      children: [
        {
          id: 'ai-unit-2-1',
          name: '1 기계학습',
          description: '데이터 전처리, 분류·회귀·군집, 모델 평가'
        },
        {
          id: 'ai-unit-2-2',
          name: '2 딥러닝',
          description: '인공 신경망, 가중치와 편향, 딥러닝의 활용'
        }
      ]
    },
    {
      id: 'ai-unit-3',
      name: 'III 인공지능의 사회적 영향',
      children: [
        {
          id: 'ai-unit-3-1',
          name: '1 인공지능과 사회',
          description: '인공지능이 바꾸는 사회와 직업의 모습'
        },
        {
          id: 'ai-unit-3-2',
          name: '2 인공지능과 윤리',
          description: '편향, 책임, 설명 가능성과 윤리적 판단'
        }
      ]
    },
    {
      id: 'ai-unit-4',
      name: 'IV 인공지능 프로젝트',
      children: [
        {
          id: 'ai-unit-4-1',
          name: '1 인공지능과 문제 해결',
          description: '문제 정의와 인공지능 활용 방안 탐색'
        },
        {
          id: 'ai-unit-4-2',
          name: '2 인공지능 프로젝트 실습',
          description: '프로젝트 계획, 개발, 성능 개선'
        }
      ]
    }
  ]
}

/**
 * 방과후 탭 메뉴 구조
 */
export const afterSchoolMenu: CategoryMenu = {
  category: '방과후',
  name: '방과후',
  description: '방과후 활동용 실습 앱',
  menuItems: [
    {
      id: 'after-1',
      name: '프로젝트 실습',
      description: '창의적 프로젝트 실습'
    },
    {
      id: 'after-2',
      name: '심화 학습',
      description: '심화 학습 및 탐구 활동'
    },
    {
      id: 'after-3',
      name: '협력 활동',
      description: '협력적 창의·융합 프로젝트'
    }
  ]
}

/**
 * 교사도구 탭 메뉴 구조
 */
export const teacherToolsMenu: CategoryMenu = {
  category: '교사도구',
  name: '교사도구',
  description: '교사용 교육 도구',
  menuItems: [
    {
      id: 'tool-1',
      name: '학급 관리',
      description: '학급 운영 및 관리 도구'
    },
    {
      id: 'tool-2',
      name: '평가 도구',
      description: '학생 평가 및 피드백 도구'
    },
    {
      id: 'tool-3',
      name: '수업 보조',
      description: '수업 보조 및 자료 생성 도구'
    }
  ]
}

/**
 * 모든 카테고리 메뉴 구조
 */
export const allMenus: CategoryMenu[] = [
  informationMenu,
  aiBasicMenu,
  afterSchoolMenu,
  teacherToolsMenu
]

/**
 * 메뉴 ID로 메뉴 정보 찾기
 */
export function findMenuById(menuId: string): MenuItem | null {
  for (const categoryMenu of allMenus) {
    for (const item of categoryMenu.menuItems) {
      if (item.id === menuId) {
        return item
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.id === menuId) {
            return child
          }
        }
      }
    }
  }
  return null
}

/**
 * 카테고리별 메뉴 가져오기
 */
export function getMenuByCategory(category: string): CategoryMenu | null {
  return allMenus.find(menu => menu.category === category) || null
}




