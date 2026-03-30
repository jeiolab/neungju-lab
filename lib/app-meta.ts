import { apps, type App } from '@/data/apps'

export function canonicalAppId(raw: string): string {
  try {
    return decodeURIComponent(raw).normalize('NFC')
  } catch {
    return raw.normalize('NFC')
  }
}

export function findAppMeta(rawId: string): App | undefined {
  const c = canonicalAppId(rawId)
  for (const app of apps) {
    if (canonicalAppId(app.id) === c || app.id === rawId) {
      return app
    }
  }
  return undefined
}
