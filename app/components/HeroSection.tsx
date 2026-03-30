'use client'

import Footer from './Footer'

export default function HeroSection() {
  return (
    <section className="relative flex-1 flex flex-col min-h-0 items-center justify-center text-center px-6 sm:px-8 lg:px-12">
      {/* Headline - serif + cursive mix */}
      <div className="mb-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
          JEIO 실습
          <br />
          지금 바로 시작하세요!
        </h1>
      </div>

      {/* Sub-headline */}
      <p className="text-slate-800 text-base sm:text-lg max-w-xl mx-auto mb-12">
        기술은 머리로만 배우지 않습니다.
        <br />
        직접 해 보고, 실수하고, 다시 도전하며 진짜 실력을 만들어 봅시다.
      </p>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0">
        <Footer />
      </div>
    </section>
  )
}
