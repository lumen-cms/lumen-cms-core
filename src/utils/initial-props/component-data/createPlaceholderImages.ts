import {
  BackgroundStoryblok,
  ImageStoryblok,
  ParallaxItemStoryblok
} from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { getPlaiceholder } from 'plaiceholder'
import { getRootImageUrl } from '../../imageServices'

export const createPlaceholderImages = async (
  item: ParallaxItemStoryblok | BackgroundStoryblok | ImageStoryblok,
  _props: AppPageProps
) => {
  if (item.image || item.source) {
    const {
      base64,
      img: { width, height }
    } = await getPlaiceholder(getRootImageUrl(item.image || item.source))
    return { base64, width, height }
  }
  return null
}
