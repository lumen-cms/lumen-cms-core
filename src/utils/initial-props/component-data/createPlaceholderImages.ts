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
  if (item.component === 'player') {
    // @ts-ignore
    src = item.fallback_image?.filename
  }
  return getPlaiceholderCached(src)
}
