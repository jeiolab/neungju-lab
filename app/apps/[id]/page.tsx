import { apps } from '@/data/apps'
import { notFound } from 'next/navigation'
import AppContentClient from './AppContentClient'

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

  // 클라이언트 컴포넌트로 전달하여 빠른 로딩
  return <AppContentClient appId={app.id} app={app} />
}

