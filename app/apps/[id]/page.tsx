import { getAppComponent } from '../appRegistry'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import AppPageClient from './AppPageClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AppPage({ params }: PageProps) {
  const { id } = await params
  // URL 인코딩된 ID를 디코딩
  const decodedId = decodeURIComponent(id)
  const AppComponent = getAppComponent(decodedId)

  return (
    <AppPageClient 
      appId={decodedId} 
      originalId={id} 
      AppComponent={AppComponent} 
    />
  )
}
