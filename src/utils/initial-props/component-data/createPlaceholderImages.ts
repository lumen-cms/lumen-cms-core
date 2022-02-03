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
  { settings }: AppPageProps
) => {
  let src = item.image || item.source || item.fallback_image
  if (src?.filename) {
    src = src.filename
  }
  if (
    item.component === 'background' &&
    settings?.image_loading?.includes('disable_background')
      ? !item.toggle_image_loading
      : item.toggle_image_loading
  ) {
    return null
  }
  if (
    (item.component === 'section_video_bg' || item.component === 'player') &&
    settings?.image_loading?.includes('disable_video')
      ? !item.toggle_image_loading
      : item.toggle_image_loading
  ) {
    return null
  }

  if (
    item.component === 'image' &&
    settings?.image_loading?.includes('disable_image')
      ? !item.toggle_image_loading
      : item.toggle_image_loading
  ) {
    return null
  }
  return getPlaiceholderCached(src)
}
