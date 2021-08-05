import { ImageLoaderProps, ImageProps } from 'next/image'
import { checkWebpSupport } from './webpSupport'

const loader = ({ src, width, quality }: ImageLoaderProps) => {
  const webP = checkWebpSupport()
  const originalPath = src.replace(/^(https?:)?\/\/a.storyblok.com\//, '')
  let opts = ''
  if (width) {
    opts += `/${width}x0`
  }
  if (webP) {
    opts += `/filters:format(webp):quality(${
      quality || process.env.NEXT_PUBLIC_IMAGE_QUALITY || 75
    })/`
  } else {
    opts += `/filters:quality(${
      quality || process.env.NEXT_PUBLIC_IMAGE_QUALITY || 75
    })/`
  }
  return `https://img2.storyblok.com${opts}${originalPath}`
}

export const storyblokImageLoader = (
  src: string | undefined
): Pick<ImageProps, 'loader' | 'unoptimized'> => {
  if (!src || src.endsWith('.svg')) {
    return {
      unoptimized: true
    }
  }
  if (src.indexOf('a.storyblok.com') === -1) {
    return { unoptimized: true }
  }
  return {
    loader
  }
}
