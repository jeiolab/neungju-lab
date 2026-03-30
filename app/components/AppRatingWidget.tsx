'use client'

import { useState } from 'react'
import { submitAppRating } from '@/lib/app-ratings'
import { useAppRatingSummary } from '@/hooks/useAppRatingSummary'

export default function AppRatingWidget({ appId }: { appId: string }) {
  const { average, count, my } = useAppRatingSummary(appId)
  const [hover, setHover] = useState(0)

  const active = hover || my || 0

  return (
    <div
      className="flex flex-col items-stretch gap-1 sm:items-end"
      onMouseLeave={() => setHover(0)}
    >
      <div className="flex justify-end gap-0.5" role="group" aria-label="앱 별점 평가">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`rounded px-0.5 text-2xl leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              star <= active ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'
            }`}
            aria-label={`${star}점 주기`}
            onMouseEnter={() => setHover(star)}
            onClick={() => submitAppRating(appId, star)}
          >
            ★
          </button>
        ))}
      </div>
      <p className="text-right text-xs text-slate-500">
        {average != null ? `평균 ${average}점` : '첫 평가를 남겨 주세요'}
        {count > 0 ? ` · ${count}명 참여` : ''}
        {my != null ? ` · 내 평가 ${my}점` : ''}
      </p>
    </div>
  )
}
