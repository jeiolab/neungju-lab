'use client'

import { useState, useEffect } from 'react'
import { apps, App } from '@/data/apps'
import { allMenus } from '@/data/menuStructure'

export default function AdminPage() {
  const [appList, setAppList] = useState<App[]>([])
  const [filteredApps, setFilteredApps] = useState<App[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [editingApp, setEditingApp] = useState<App | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    setAppList(apps)
    setFilteredApps(apps)
  }, [])

  useEffect(() => {
    let filtered = appList

    if (searchTerm) {
      filtered = filtered.filter(
        app =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(app => app.category === selectedCategory)
    }

    setFilteredApps(filtered)
  }, [searchTerm, selectedCategory, appList])

  const handleEdit = (app: App) => {
    setEditingApp({ ...app })
  }

  const handleSave = async () => {
    if (!editingApp) return

    setIsSaving(true)
    setSaveMessage('')

    try {
      const response = await fetch('/api/admin/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appId: editingApp.id,
          updates: {
            menuId: editingApp.menuId,
            category: editingApp.category,
            description: editingApp.description,
            badge: editingApp.badge,
          },
        }),
      })

      if (response.ok) {
        const updatedApps = appList.map(app =>
          app.id === editingApp.id ? editingApp : app
        )
        setAppList(updatedApps)
        setEditingApp(null)
        setSaveMessage('저장되었습니다!')
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        setSaveMessage('저장 실패: ' + (await response.text()))
      }
    } catch (error) {
      setSaveMessage('저장 중 오류가 발생했습니다.')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingApp(null)
    setSaveMessage('')
  }

  // 모든 menuId 수집
  const allMenuIds = new Set<string>()
  allMenus.forEach(categoryMenu => {
    categoryMenu.menuItems.forEach(item => {
      allMenuIds.add(item.id)
      if (item.children) {
        item.children.forEach(child => allMenuIds.add(child.id))
      }
    })
  })

  const categories = ['all', '정보', '인공지능기초', '방과후', '교사도구', '수업도구', '방과후학교'] as const

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">앱 관리자 페이지</h1>

          {/* 검색 및 필터 */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="앱 이름, ID, 설명으로 검색..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? '전체 카테고리' : cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              총 {filteredApps.length}개 앱 표시 중
            </div>
          </div>

          {/* 저장 메시지 */}
          {saveMessage && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                saveMessage.includes('실패') || saveMessage.includes('오류')
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {saveMessage}
            </div>
          )}

          {/* 앱 목록 */}
          <div className="space-y-4">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {editingApp?.id === app.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        앱 ID
                      </label>
                      <input
                        type="text"
                        value={editingApp.id}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        앱 이름
                      </label>
                      <input
                        type="text"
                        value={editingApp.name}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        설명
                      </label>
                      <textarea
                        value={editingApp.description || ''}
                        onChange={e =>
                          setEditingApp({ ...editingApp, description: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          카테고리
                        </label>
                        <select
                          value={editingApp.category || ''}
                          onChange={e =>
                            setEditingApp({
                              ...editingApp,
                              category: e.target.value as App['category'],
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">선택 안 함</option>
                          {categories
                            .filter(c => c !== 'all')
                            .map(cat => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          배지
                        </label>
                        <select
                          value={editingApp.badge || ''}
                          onChange={e =>
                            setEditingApp({
                              ...editingApp,
                              badge: e.target.value as App['badge'] | undefined,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">선택 안 함</option>
                          <option value="new">new</option>
                          <option value="popular">popular</option>
                          <option value="default">default</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Menu ID
                      </label>
                      <input
                        type="text"
                        value={editingApp.menuId || ''}
                        onChange={e =>
                          setEditingApp({ ...editingApp, menuId: e.target.value })
                        }
                        list="menuIds"
                        placeholder="예: unit-1-1, unit-4-2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <datalist id="menuIds">
                        {Array.from(allMenuIds).map(menuId => (
                          <option key={menuId} value={menuId} />
                        ))}
                      </datalist>
                      <div className="mt-1 text-xs text-gray-500">
                        사용 가능한 Menu ID: {Array.from(allMenuIds).join(', ')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? '저장 중...' : '저장'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                        {app.badge && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            {app.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{app.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>
                          <strong>ID:</strong> {app.id}
                        </span>
                        {app.category && (
                          <span>
                            <strong>카테고리:</strong> {app.category}
                          </span>
                        )}
                        {app.menuId && (
                          <span>
                            <strong>Menu ID:</strong> {app.menuId}
                          </span>
                        )}
                        {!app.menuId && (
                          <span className="text-red-600">
                            <strong>Menu ID 없음</strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(app)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      수정
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
