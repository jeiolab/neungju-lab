/**
 * 앱 그룹화 유틸리티
 * 메뉴 구조 기반으로 앱을 그룹화하는 로직
 */

import { App } from '@/data/apps'
import { getMenuByCategory, MenuItem } from '@/data/menuStructure'

export interface GroupedApps {
  grouped: Record<string, App[]>
  menuStructure: ReturnType<typeof getMenuByCategory>
  ungroupedApps: App[]
}

/**
 * 메뉴 구조 기반으로 앱을 그룹화합니다
 */
export function groupAppsByMenu(
  apps: App[], 
  category: '정보' | '인공지능기초' | '방과후' | '교사도구' | '수업도구' | '방과후학교'
): GroupedApps | null {
  // 카테고리 매핑
  const categoryMap: Record<string, '정보' | '인공지능기초' | '방과후' | '교사도구'> = {
    '정보': '정보',
    '인공지능기초': '인공지능기초',
    '방과후': '방과후',
    '방과후학교': '방과후',
    '수업도구': '교사도구',
    '교사도구': '교사도구'
  }
  
  const mappedCategory = categoryMap[category] || category as '정보' | '인공지능기초' | '방과후' | '교사도구'
  const menuStructure = getMenuByCategory(mappedCategory)
  if (!menuStructure) return null

  const grouped: Record<string, App[]> = {}

  // 모든 메뉴 항목 초기화
  const initializeMenuItems = (items: MenuItem[]) => {
    items.forEach(item => {
      grouped[item.id] = []
      if (item.children) {
        initializeMenuItems(item.children)
      }
    })
  }

  initializeMenuItems(menuStructure.menuItems)

  // 앱을 메뉴에 할당
  apps.forEach(app => {
    if (app.menuId && grouped[app.menuId]) {
      grouped[app.menuId].push(app)
    }
  })

  // 할당되지 않은 앱 찾기
  const assignedAppIds = new Set(
    Object.values(grouped).flatMap(apps => apps.map(a => a.id))
  )
  const ungroupedApps = apps.filter(app => !assignedAppIds.has(app.id))

  return { grouped, menuStructure, ungroupedApps }
}




