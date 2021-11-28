import {
  BackgroundStoryblok,
  ImageStoryblok,
  ParallaxItemStoryblok,
  PlayerStoryblok,
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
    | SectionVideoBgStoryblok
    | PlayerStoryblok,
  _props: AppPageProps
) => {
  let src = item.image || item.source || item.fallback_image
  if (item.component === 'player') {
    // @ts-ignore
    src = item.fallback_image?.filename
  }
  if (src) {
    const {
      base64,
      img: { width, height }
    } = await getPlaiceholder(getRootImageUrl(src))
    return { base64, width, height }
  }
  return null
}
