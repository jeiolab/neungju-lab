'use client'

import React, { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { App } from '@/data/apps'
import AppCard from './AppCard'

interface UnitAccordionProps {
  unitId: string
  unitName: string
  unitDescription?: string
  subunits: Array<{
    id: string
    name: string
    description?: string
    apps: App[]
  }>
  defaultOpen?: boolean
}

const STORAGE_KEY = 'jeio-open-units'

// localStorage에서 열린 단원 목록 가져오기
function getOpenUnits(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
}

// localStorage에 열린 단원 목록 저장하기
function saveOpenUnits(openUnits: Set<string>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(openUnits)))
  } catch {
    // localStorage 저장 실패 시 무시
  }
}

export default function UnitAccordion({
  unitId,
  unitName,
  unitDescription,
  subunits,
  defaultOpen = false
}: UnitAccordionProps) {
  // 초기 상태는 항상 defaultOpen으로 설정 (서버와 클라이언트 동일하게)
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [mounted, setMounted] = useState(false)

  // 클라이언트에서만 마운트 후 localStorage에서 상태 복원
  useEffect(() => {
    setMounted(true)
    const openUnits = getOpenUnits()
    if (openUnits.has(unitId)) {
      setIsOpen(true)
    }
  }, [unitId])

  // 단원 열림/닫힘 상태가 변경될 때 localStorage에 저장 (마운트된 후에만)
  useEffect(() => {
    if (!mounted) return
    
    const openUnits = getOpenUnits()
    if (isOpen) {
      openUnits.add(unitId)
    } else {
      openUnits.delete(unitId)
    }
    saveOpenUnits(openUnits)
  }, [isOpen, unitId, mounted])

  // 단원에 속한 총 앱 수 계산
  const totalApps = subunits.reduce((sum, subunit) => sum + subunit.apps.length, 0)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* 단원 헤더 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen((prev) => !prev)
        }}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left relative z-0"
        type="button"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{unitName}</h2>
            {unitDescription && (
              <p className="text-sm text-gray-500 mt-1">{unitDescription}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {totalApps}개 앱
            </span>
          </div>
        </div>
      </button>

      {/* 단원 내용 (아코디언) */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-4 space-y-6">
            {subunits.map((subunit) => (
              <div key={subunit.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {subunit.name}
                  </h3>
                  {subunit.description && (
                    <span className="text-xs text-gray-500">
                      ({subunit.description})
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${
                    subunit.apps.length > 0 
                      ? 'text-gray-400 bg-white' 
                      : 'text-gray-300 bg-gray-50'
                  }`}>
                    {subunit.apps.length}개
                  </span>
                </div>
                {subunit.apps.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subunit.apps.map((app) => (
                      <AppCard key={app.id} app={app} />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 border-dashed text-center">
                    <p className="text-sm text-gray-400">
                      아직 등록된 앱이 없습니다
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      새로운 앱을 추가하면 여기에 표시됩니다
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

