import { ImageLoaderProps, ImageProps } from 'next/image'
import { loader } from './storyblokImageLoader'

const loaderRaw = ({ src, width, quality }: ImageLoaderProps) => {
  const url = new URL('https://prx-11-1.lumen.media/_next/image')
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
  // if (!src || src.endsWith('.svg')) {
  //   return {
  //     unoptimized: true
  //   }
  // }
  if (src?.indexOf('a.storyblok.com') !== -1) {
    return { loader }
  }
  return {
    loader: loaderRaw
  }
}
