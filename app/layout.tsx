import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JEIO 실습 화면',
  description: '기술 역량의 관문. 기술의 세계로 뛰어들 준비가 된 모든 학생들에게 따뜻한 환영을 전합니다.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="light">
      <body className="font-display bg-background-light text-gray-900">{children}</body>
    </html>
  )
}

