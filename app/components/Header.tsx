'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex items-center justify-end whitespace-nowrap border-b border-solid border-gray-200 px-6 sm:px-10 lg:px-20 py-4 bg-white sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex flex-1 justify-end gap-6 items-center">
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-800 hover:text-primary transition-colors">
            홈
          </Link>
        </div>
      </div>
    </header>
  )
}
