import {
  BackgroundStoryblok,
  ImageStoryblok,
  ParallaxItemStoryblok,
  SectionVideoBgStoryblok
} from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { getPlaiceholder } from 'plaiceholder'
import { getRootImageUrl } from '../../imageServices'

export const createPlaceholderImages = async (
  item:
    | ParallaxItemStoryblok
    | BackgroundStoryblok
    | ImageStoryblok
    | SectionVideoBgStoryblok,
  _props: AppPageProps
) => {
  let src = item.image || item.source || item.fallback_image
  if (src) {
    const {
      base64,
      img: { width, height }
    } = await getPlaiceholder(getRootImageUrl(src))
    return { base64, width, height }
  }
  return null
}
