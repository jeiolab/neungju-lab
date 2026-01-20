'use client'

import { useState, useEffect } from 'react'
import { apps } from '@/data/apps'
import { App } from '@/data/apps'
import { getMenuByCategory } from '@/data/menuStructure'

export default function AdminPage() {
  const [appList, setAppList] = useState<App[]>([])
  const [selectedApp, setSelectedApp] = useState<App | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState<'정보' | '인공지능기초' | '방과후' | '교사도구'>('정보')
  const [menuOptions, setMenuOptions] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    setAppList(apps)
    const menuStructure = getMenuByCategory(category)
    if (menuStructure) {
      const options: Array<{ id: string; name: string }> = []
      const extractMenuItems = (items: typeof menuStructure.menuItems) => {
        items.forEach(item => {
          if (item.children) {
            item.children.forEach(child => {
              options.push({ id: child.id, name: `${item.name} > ${child.name}` })
            })
          } else {
            options.push({ id: item.id, name: item.name })
          }
        })
      }
      extractMenuItems(menuStructure.menuItems)
      setMenuOptions(options)
    }
  }, [category])

  const filteredApps = appList.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAppUpdate = (appId: string, field: keyof App, value: any) => {
    setAppList(prev => prev.map(app => 
      app.id === appId ? { ...app, [field]: value } : app
    ))
    
    if (selectedApp?.id === appId) {
      setSelectedApp({ ...selectedApp, [field]: value })
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apps: appList }),
      })

      const result = await response.json()
      
      if (response.ok) {
        alert(`설정이 저장되었습니다! (${result.count}개 앱)`)
        // 페이지 새로고침하여 최신 데이터 로드
        window.location.reload()
      } else {
        alert(`저장 실패: ${result.error || '알 수 없는 오류'}`)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(appList, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'apps-config.json'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">앱 관리 페이지</h1>
          <p className="text-gray-600">앱의 menuId, 카테고리 등을 수정할 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 앱 목록 */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="앱 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="정보">정보</option>
                <option value="인공지능기초">인공지능기초</option>
                <option value="방과후">방과후</option>
                <option value="교사도구">교사도구</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredApps
                .filter(app => !app.category || app.category === category || (category === '정보' && !app.category))
                .map(app => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                    selectedApp?.id === app.id
                      ? 'bg-blue-50 border-blue-500 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium text-gray-900">{app.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{app.id}</div>
                  {app.menuId && (
                    <div className="text-xs text-blue-600 mt-1">menuId: {app.menuId}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 오른쪽: 앱 상세 정보 및 수정 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            {selectedApp ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedApp.name}</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        앱 ID
                      </label>
                      <input
                        type="text"
                        value={selectedApp.id}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        카테고리
                      </label>
                      <select
                        value={selectedApp.category || '정보'}
                        onChange={(e) => handleAppUpdate(selectedApp.id, 'category', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="정보">정보</option>
                        <option value="인공지능기초">인공지능기초</option>
                        <option value="방과후">방과후</option>
                        <option value="교사도구">교사도구</option>
                        <option value="수업도구">수업도구</option>
                        <option value="방과후학교">방과후학교</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Menu ID
                      </label>
                      <select
                        value={selectedApp.menuId || ''}
                        onChange={(e) => handleAppUpdate(selectedApp.id, 'menuId', e.target.value || undefined)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">선택 안 함</option>
                        {menuOptions.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        설명
                      </label>
                      <textarea
                        value={selectedApp.description}
                        onChange={(e) => handleAppUpdate(selectedApp.id, 'description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Badge
                      </label>
                      <select
                        value={selectedApp.badge || ''}
                        onChange={(e) => handleAppUpdate(selectedApp.id, 'badge', e.target.value || undefined)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">없음</option>
                        <option value="new">New</option>
                        <option value="popular">Popular</option>
                        <option value="default">Default</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleExport}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    JSON 내보내기
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                왼쪽에서 앱을 선택하세요
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
