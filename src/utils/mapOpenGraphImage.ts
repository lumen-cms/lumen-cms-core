import { ImageCoreStoryblok } from '../typings/generated/components-schema'
import { getOriginalImageDimensions, imageServiceNoWebp } from './imageServices'
import { OpenGraphMedia } from 'next-seo/lib/types.d'

export const getImageCoreUrl = (item: ImageCoreStoryblok) => {
  let imgPath =
    item.width || item.height ? `${item.width || 0}x${item.height || 0}` : ''
  if (item.width && item.height) {
    imgPath += '/smart'
  }
  return imageServiceNoWebp(item.url, imgPath)
}

export const mapOpenGraphImage = (
  item: ImageCoreStoryblok
): OpenGraphMedia | undefined => {
  if (!item.url) return undefined
  const dimensions = getOriginalImageDimensions(item.url)
  if (dimensions.width > 1200 && dimensions.height > 630) {
    return {
      height: 630,
      width: 1200,
      alt: item.alt,
      url: getImageCoreUrl({ ...item, width: 1200, height: 630 })
    }
  }
  return {
    height: item.height || dimensions.height,
    width: item.width || dimensions.width,
    alt: item.alt,
    url: getImageCoreUrl(item)
  }
}
