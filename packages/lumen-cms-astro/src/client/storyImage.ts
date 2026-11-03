import { storyblokImageUrl } from '../images/storyblok-service'
import { isStoryblokImage, isSvgImage, normalizeImageSource } from '../images/policy'

/** Rebind client-only templates; non-CDN sources need server-rendered markup
 * for optimization and must not advertise fake resized variants. */
export function updateStoryImage(image: HTMLImageElement, source: string) {
 const quality = Number(/quality\((\d+)\)/.exec(image.src)?.[1]) || 75
 if (!isStoryblokImage(source) || isSvgImage(source)) {
  image.src = normalizeImageSource(source)
  image.removeAttribute('srcset')
  return
 }
 const baseWidth = image.width || 1200
 const candidates = image.srcset.split(',').map(part => {
  const match = /(\d+(?:\.\d+)?)(w|x)\s*$/.exec(part)
  if (!match) return ''
  const width = Number(match[1]) * (match[2] === 'x' ? baseWidth : 1)
  return `${storyblokImageUrl(source, width, quality)} ${match[1]}${match[2]}`
 }).filter(Boolean)
 image.src = storyblokImageUrl(source, baseWidth, quality)
 image.srcset = candidates.join(', ')
}
