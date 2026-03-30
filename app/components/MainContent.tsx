'use client'

import { useMemo } from 'react'
import { apps } from '@/data/apps'
import { groupAppsByMenu } from '../utils/appGrouping'
import UnitAccordion from './UnitAccordion'
import AppCard from './AppCard'

type Category = '정보' | '인공지능기초' | '수업도구' | '방과후학교'

interface MainContentProps {
  selectedCategory: Category
  setSelectedCategory: (category: Category) => void
  compactMode?: boolean
}

export default function MainContent({ selectedCategory, setSelectedCategory, compactMode }: MainContentProps) {
  // 정보 페이지에서는 정보/인공지능기초/방과후만 표시, 수업도구는 수업도구 탭에만 표시
  const filteredApps = useMemo(() => {
    if (selectedCategory === '정보') {
      return apps.filter(app => app.category === '정보' || app.category === '인공지능기초' || app.category === '방과후학교' || app.category === '방과후' || !app.category)
    }
    if (selectedCategory === '수업도구') {
      return apps.filter(app => app.category === '수업도구' || app.category === '교사도구')
    }
    if (selectedCategory === '방과후학교') {
      return apps.filter(app => app.category === '방과후학교' || app.category === '방과후')
    }
    return apps.filter(app => app.category === selectedCategory)
  }, [selectedCategory])

  const menuGroups = useMemo(
    () =>
      groupAppsByMenu(
        filteredApps,
        selectedCategory === '방과후학교'
          ? '방과후'
          : selectedCategory === '수업도구'
            ? '교사도구'
            : selectedCategory
      ),
    [filteredApps, selectedCategory]
  )

  // 정보 페이지에서 다른 카테고리 앱들 (메뉴에 없는 앱들)
  const { otherCategoryApps, remainingUngrouped } = useMemo(() => {
    if (!menuGroups) {
      return { otherCategoryApps: { ai: [], after: [], tools: [] }, remainingUngrouped: [] }
    }
    if (selectedCategory !== '정보') {
      return { otherCategoryApps: { ai: [], after: [], tools: [] }, remainingUngrouped: menuGroups.ungroupedApps }
    }
    const ungrouped = menuGroups.ungroupedApps
    const ai = ungrouped.filter(a => a.category === '인공지능기초')
    const after = ungrouped.filter(a => a.category === '방과후학교' || a.category === '방과후')
    const tools = ungrouped.filter(a => a.category === '수업도구' || a.category === '교사도구')
    const shownIds = new Set([...ai, ...after, ...tools].map(a => a.id))
    const remaining = ungrouped.filter(a => !shownIds.has(a.id))
    return {
      otherCategoryApps: { ai, after, tools },
      remainingUngrouped: remaining
    }
  }, [selectedCategory, menuGroups])

  return (
    <div className="flex flex-col">
      {menuGroups && menuGroups.menuStructure ? (
        <div className="space-y-4">
          {selectedCategory === '정보' ? (
            menuGroups.menuStructure.menuItems.map((menuItem) => {
              const hasChildren = menuItem.children && menuItem.children.length > 0

              if (!hasChildren) return null

              const subunits = menuItem.children!.map(child => ({
                id: child.id,
                name: child.name,
                description: child.description,
                apps: menuGroups.grouped[child.id] || []
              }))

              return (
                <UnitAccordion
                  key={menuItem.id}
                  unitId={menuItem.id}
                  unitName={menuItem.name}
                  unitDescription={menuItem.description}
                  subunits={subunits}
                  defaultOpen={false}
                />
              )
            })
          ) : (
            menuGroups.menuStructure?.menuItems.map((menuItem) => {
              const hasChildren = menuItem.children && menuItem.children.length > 0
              const directApps = menuGroups.grouped[menuItem.id] || []

              if (hasChildren) {
                const hasAppsInChildren = menuItem.children!.some(child =>
                  (menuGroups.grouped[child.id] || []).length > 0
                )
                if (!hasAppsInChildren) return null
              } else if (directApps.length === 0) {
                return null
              }

              return (
                <div key={menuItem.id} className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => setSelectedCategory('정보')}
                      className={`text-2xl font-bold hover:text-primary transition-colors text-left ${
                        compactMode ? 'text-white hover:text-amber-400' : 'text-gray-900'
                      }`}
                    >
                      {menuItem.name}
                    </button>
                    {menuItem.description && (
                      <span className={`text-sm ${compactMode ? 'text-white/70' : 'text-gray-500'}`}>({menuItem.description})</span>
                    )}
                    <div className={`flex-1 h-px ${compactMode ? 'bg-white/30' : 'bg-gray-200'}`}></div>
                  </div>

                  {!hasChildren && directApps.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {directApps.map((app) => (
                        <AppCard key={app.id} app={app} />
                      ))}
                    </div>
                  )}

                  {hasChildren && menuItem.children!.map((childItem) => {
                    const childApps = menuGroups.grouped[childItem.id] || []
                    if (childApps.length === 0) return null

                    return (
                      <div key={childItem.id} className="space-y-3">
                        <button
                          onClick={() => setSelectedCategory('정보')}
                          className={`block text-lg font-semibold ml-2 hover:text-primary transition-colors text-left w-full ${
                            compactMode ? 'text-white/90 hover:text-amber-400' : 'text-gray-700'
                          }`}
                        >
                          {childItem.name}
                          {childItem.description && (
                            <span className={`text-sm font-normal ml-2 ${compactMode ? 'text-white/70' : 'text-gray-500'}`}>
                              - {childItem.description}
                            </span>
                          )}
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {childApps.map((app) => (
                            <AppCard key={app.id} app={app} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })
          )}

          {selectedCategory === '정보' && (otherCategoryApps.ai.length > 0 || otherCategoryApps.after.length > 0 || otherCategoryApps.tools.length > 0) && (
            <>
              {otherCategoryApps.ai.length > 0 && (
                <div className="space-y-4 mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">인공지능기초</h2>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherCategoryApps.ai.map((app) => (
                      <AppCard key={app.id} app={app} />
                    ))}
                  </div>
                </div>
              )}
              {otherCategoryApps.after.length > 0 && (
                <div className="space-y-4 mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">방과후학교</h2>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherCategoryApps.after.map((app) => (
                      <AppCard key={app.id} app={app} />
                    ))}
                  </div>
                </div>
              )}
              {otherCategoryApps.tools.length > 0 && (
                <div className="space-y-4 mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">수업도구</h2>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherCategoryApps.tools.map((app) => (
                      <AppCard key={app.id} app={app} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {((selectedCategory !== '정보' ? menuGroups.ungroupedApps : remainingUngrouped) ?? []).length > 0 && (
            <div className="space-y-4 mt-8">
              {selectedCategory === '정보' && (
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">기타</h2>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {((selectedCategory !== '정보' ? menuGroups.ungroupedApps : remainingUngrouped) ?? []).map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="text-center space-y-4">
              <p className={`text-base font-normal ${compactMode ? 'text-white/80' : 'text-gray-600'}`}>
                {selectedCategory} 카테고리에 등록된 앱이 없습니다.
              </p>
            </div>
          </div>
        )
      )}
    </div>
  )
}
