'use client'

import { useState } from 'react'
import { apps } from '@/data/apps'
import { groupAppsByMenu } from './utils/appGrouping'
import Header from './components/Header'
import Footer from './components/Footer'
import UnitAccordion from './components/UnitAccordion'
import AppCard from './components/AppCard'

type Category = '정보' | '인공지능기초' | '수업도구' | '방과후학교'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('정보')

  const filteredApps = apps.filter(app => 
    app.category === selectedCategory || (!app.category && selectedCategory === '정보')
  )

  const categories: Category[] = ['정보', '인공지능기초', '방과후학교', '수업도구']
  const menuGroups = groupAppsByMenu(filteredApps, selectedCategory === '방과후학교' ? '방과후' : selectedCategory === '수업도구' ? '교사도구' : selectedCategory)

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col">
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-900">
              JEIO 실습, 지금 바로 시작하세요!
            </h1>
            <p className="text-base font-normal text-gray-600">
              기술은 머리로만 배우지 않습니다. 직접 해 보고, 실수하고, 다시 도전하며 진짜 실력을 만들어 봅시다.
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex border-b border-gray-200 gap-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 transition-colors ${
                    selectedCategory === category
                      ? 'border-b-primary'
                      : 'border-b-transparent'
                  }`}
                >
                  <p className={`text-sm font-bold transition-colors ${
                    selectedCategory === category
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-primary'
                  }`}>
                    {category}
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          {menuGroups && menuGroups.menuStructure ? (
            <div className="space-y-4">
              {selectedCategory === '정보' ? (
                // 정보 탭: 아코디언 형태로 단원별 표시
                menuGroups.menuStructure.menuItems.map((menuItem) => {
                  const hasChildren = menuItem.children && menuItem.children.length > 0
                  
                  if (!hasChildren) return null

                  // 소단원별로 앱 그룹화 (앱이 없어도 모두 포함)
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
                // 다른 탭: 기존 방식 (그리드)
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
                        <h2 className="text-2xl font-bold text-gray-900">{menuItem.name}</h2>
                        {menuItem.description && (
                          <span className="text-sm text-gray-500">({menuItem.description})</span>
                        )}
                        <div className="flex-1 h-px bg-gray-200"></div>
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
                            <h3 className="text-lg font-semibold text-gray-700 ml-2">
                              {childItem.name}
                              {childItem.description && (
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                  - {childItem.description}
                                </span>
                              )}
                            </h3>
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

              {/* 메뉴에 할당되지 않은 앱 표시 */}
              {menuGroups.ungroupedApps.length > 0 && (
                <div className="space-y-4 mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">기타</h2>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuGroups.ungroupedApps.map((app) => (
                      <AppCard key={app.id} app={app} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // 메뉴 구조가 없거나 앱이 없는 경우
            filteredApps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <div className="text-center space-y-4">
                  <p className="text-base font-normal text-gray-600">
                    {selectedCategory} 카테고리에 등록된 앱이 없습니다.
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
