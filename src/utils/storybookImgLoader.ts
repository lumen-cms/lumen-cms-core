import { ImageLoaderProps, ImageProps } from 'next/image'
import { loader } from './storyblokImageLoader'

const loaderRaw = ({ src, width, quality }: ImageLoaderProps) => {
  const url = new URL('https://img-12.lumen.media/_next/image')
  url.searchParams.set('url', src)
  if (width) {
    url.searchParams.set('w', `${width}`)
  }
  url.searchParams.set('q', `${quality || 75}`)
  return url.toString()
}

export const storybookImgLoader = (
  src: string | undefined
): Pick<ImageProps, 'loader' | 'unoptimized'> => {
  if (src?.startsWith('/') && !src.startsWith('//'))
    return { unoptimized: true }
  const hostname = src ? new URL(src, 'https://a.storyblok.com').hostname : ''
  if (hostname === 'a.storyblok.com' || hostname === 'img2.storyblok.com') {
    return { loader }
  }
  return {
    loader: loaderRaw
  }
}
