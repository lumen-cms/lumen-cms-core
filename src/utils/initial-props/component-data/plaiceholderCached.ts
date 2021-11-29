import { getPlaiceholder } from 'plaiceholder'
import { getRootImageUrl } from '../../imageServices'
import { LmImagePlaceholder } from '../../../components/image/imageTypes'

const cache = {}
export const getPlaiceholderCached = async (
  source: string
): Promise<LmImagePlaceholder | null> => {
  if (!source) return null
  if (cache[source]) {
    return cache[source]
  }
  let rootImageUrl = getRootImageUrl(source)
  const {
    base64,
    img: { width, height }
  } = await getPlaiceholder(rootImageUrl + '/m/')
  const cacheVal = {
    base64,
    width,
    height
  }
  cache[source] = cacheVal
  return cacheVal
}
