import createCache from '@emotion/cache'
import { EmotionCache } from '@emotion/react'

let muiCache: EmotionCache | undefined = undefined

export default function createEmotionCache() {
  if (muiCache) {
    return muiCache
  }
  muiCache = createCache({ key: 'css', prepend: true })
  return muiCache
}
