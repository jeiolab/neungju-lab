import Link from 'next/link'
import { apps } from '@/data/apps'
import { notFound } from 'next/navigation'
import AppWrapper from './components/AppWrapper'
import DigitalSurvivalApp from '../digital-survival/DigitalSurvivalApp'
import NetworkQuizChallengeApp from '../network-quiz-challenge/NetworkQuizChallengeApp'
import MissingIPCaseApp from '../missing-ip-case/MissingIPCaseApp'
import SmartPairingApp from '../smart-pairing/SmartPairingApp'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export async function generateStaticParams() {
  return apps.map((app) => ({
    id: app.id,
  }))
}

export default function AppPage({ params }: { params: { id: string } }) {
  const app = apps.find((a) => a.id === params.id)

  if (!app) {
    notFound()
  }

  // 디지털 생존 가이드 앱인 경우 특별 처리
  if (app.id === 'digital-survival') {
    return <DigitalSurvivalApp />
  }

  // 네트워크 퀴즈 챌린지인 경우 특별 처리
  if (app.id === 'network-quiz-challenge') {
    return <NetworkQuizChallengeApp />
  }

  // 사라진 IP 주소 사건인 경우 특별 처리
  if (app.id === 'missing-ip-case') {
    return <MissingIPCaseApp />
  }

  // 지능형 짝꿍 배치 시스템인 경우 특별 처리
  if (app.id === 'smart-pairing') {
    return <SmartPairingApp />
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary mb-6"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          홈으로 돌아가기
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 mb-3">
              {app.name}
            </h1>
            <p className="text-base font-normal text-gray-600">
              {app.description}
            </p>
          </div>
          
          <AppWrapper appId={app.id} url={app.url}>
            <div className="p-8 bg-gray-50 rounded-lg text-center">
              <span className="material-symbols-outlined text-6xl text-gray-400 mb-4 inline-block">
                apps
              </span>
              <p className="text-gray-600 mb-2">이 앱의 내용을 여기에 추가하세요.</p>
              <p className="text-sm text-gray-500">
                구글 AI 스튜디오에서 제작한 앱의 코드를 이 컴포넌트에 통합하거나,
                외부 URL이 있다면 apps.ts에서 url 필드를 추가하세요.
              </p>
            </div>
          </AppWrapper>
        </div>
      </main>
      <Footer />
    </div>
  )
}

