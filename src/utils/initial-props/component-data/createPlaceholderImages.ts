import {
  BackgroundStoryblok,
  ImageStoryblok,
  ParallaxItemStoryblok,
  PlayerStoryblok,
  SectionVideoBgStoryblok
} from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { getPlaiceholderCached } from './plaiceholderCached'

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
  if (src?.filename) {
    src = src.filename
  }
  return getPlaiceholderCached(src)
}
