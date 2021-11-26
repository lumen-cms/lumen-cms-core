import {
  BackgroundStoryblok,
  ParallaxItemStoryblok
} from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { getPlaiceholder } from 'plaiceholder'
import { getRootImageUrl } from '../../imageServices'

export const createPlaceholderImages = async (
  item: ParallaxItemStoryblok | BackgroundStoryblok,
  _props: AppPageProps
) => {
  if (item.image) {
    const { base64 } = await getPlaiceholder(getRootImageUrl(item.image))
    return base64
  }
  return null
}
