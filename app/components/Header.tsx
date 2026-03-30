'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PRACTICE_CATALOG_HREF } from '@/lib/routes'

type Category = '정보' | '인공지능기초' | '수업도구' | '방과후학교'

interface HeaderProps {
  selectedCategory?: Category
  setSelectedCategory?: (category: Category | '홈') => void
  isHomeView?: boolean
}

const NAV_ITEMS: { id: '홈' | Category; label: string; category?: Category }[] = [
  { id: '홈', label: '홈' },
  { id: '정보', label: '정보', category: '정보' },
  { id: '인공지능기초', label: '인공지능기초', category: '인공지능기초' },
  { id: '방과후학교', label: '방과후', category: '방과후학교' },
  { id: '수업도구', label: '수업도구', category: '수업도구' },
]

function getTabKey(category: Category): string {
  return category === '방과후학교' ? '방과후' : category
}

export default function Header({ selectedCategory = '정보', setSelectedCategory, isHomeView = false }: HeaderProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToMain = () => {
    document.getElementById('실습-시작하기')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleNavClick = (item: (typeof NAV_ITEMS)[number]) => {
    setMenuOpen(false)
    if (item.id === '홈') {
      setSelectedCategory?.('홈')
      if (isHomePage) {
        scrollToTop()
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', window.location.pathname)
        }
      }
    } else if (item.category) {
      setSelectedCategory?.(item.category)
      if (isHomePage) {
        const tabKey = getTabKey(item.category)
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `${window.location.pathname}?tab=${tabKey}`)
        }
        requestAnimationFrame(() => setTimeout(scrollToMain, 50))
      }
    }
  }

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.id === '홈') return isHomeView
    if (item.category === '정보') return selectedCategory === '정보' && !isHomeView
    return item.category === selectedCategory
  }

  const NavContent = () => (
    <>
      {NAV_ITEMS.map((item) =>
        isHomePage && setSelectedCategory ? (
          <button
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={`whitespace-nowrap transition-colors ${isActive(item) ? 'text-white' : 'text-white/80 hover:text-white'}`}
          >
            {item.label}
          </button>
        ) : (
          <Link
            key={item.id}
            href={item.id === '홈' ? '/' : `/?tab=${item.category ? getTabKey(item.category) : ''}`}
            className="whitespace-nowrap transition-colors text-white/80 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        )
      )}
    </>
  )

  return (
    <header className="flex items-center justify-between px-6 sm:px-8 lg:px-12 py-4">
      <Link
        href={pathname.startsWith('/apps/') ? PRACTICE_CATALOG_HREF : '/'}
        className="flex items-center gap-0.5"
      >
        <span className="text-lg font-bold tracking-tight text-slate-900 uppercase">JEIO</span>
        <span className="text-lg font-normal tracking-tight text-slate-900 uppercase">
          / {pathname.startsWith('/apps/') || isHomeView ? '홈' : (selectedCategory === '방과후학교' ? '방과후' : selectedCategory)}
        </span>
      </Link>

      {/* Hamburger menu - 모든 페이지에 적용 */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2 -mr-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="메뉴"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 sm:right-12 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <nav className="flex flex-col items-center gap-10 text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white">
            <NavContent />
          </nav>
        </div>
      )}
    </header>
  )
}
