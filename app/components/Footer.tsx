'use client'

export default function Footer() {
  return (
    <div className="px-6 sm:px-8 lg:px-12 py-6 flex-shrink-0">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-slate-800">
          오류 및 문의: <a href="mailto:ilsangsw@gmail.com" className="text-slate-900 hover:underline font-medium">ilsangsw@gmail.com</a>
        </p>
        <p className="text-xs text-slate-700 leading-relaxed">
          Copyright © {new Date().getFullYear()} JEIO. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}
