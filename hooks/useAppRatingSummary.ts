'use client'

import { useEffect, useState } from 'react'
import { APP_RATINGS_EVENT, getRatingSummary } from '@/lib/app-ratings'

export function useAppRatingSummary(appId: string) {
  const [state, setState] = useState(() => getRatingSummary(appId))

  useEffect(() => {
    setState(getRatingSummary(appId))
    const onChange = () => setState(getRatingSummary(appId))
    window.addEventListener(APP_RATINGS_EVENT, onChange)
    return () => window.removeEventListener(APP_RATINGS_EVENT, onChange)
  }, [appId])

  return state
}
