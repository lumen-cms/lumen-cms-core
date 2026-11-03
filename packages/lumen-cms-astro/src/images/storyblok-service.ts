import { isStoryblokImage, isSvgImage } from './policy'

export function storyblokImageUrl(source: string, width?: number, quality: number = 75): string {
  const normalized = source.startsWith('//') ? `https:${source}` : source
  const url = new URL(normalized, 'https://a.storyblok.com')
  if (!isStoryblokImage(normalized) || isSvgImage(normalized)) return normalized
  const original = url.pathname.split('/m/')[0].replace(/\/m$/, '')
  return `${url.origin}${original}/m${width ? `/${Math.round(width)}x0` : ''}/filters:quality(${quality})`
}
