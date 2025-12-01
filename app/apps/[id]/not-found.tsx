import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container">
      <div className="app-container" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>앱을 찾을 수 없습니다</h2>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          요청하신 앱이 존재하지 않습니다.
        </p>
        <Link href="/" className="back-button" style={{ display: 'inline-block' }}>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

