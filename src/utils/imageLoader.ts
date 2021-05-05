import { ImageLoaderProps, ImageProps } from 'next/image'

let hasWebpSupport: boolean | undefined

const initWebpSupport = () => {
  // https://github.com/ihordiachenko/supports-webp-sync
  // Check FF, Edge by user agent
  if (typeof navigator === 'undefined') {
    return true // in nodejs we set true
  }
  const match = navigator?.userAgent.match(/(Edge|Firefox|Safari)\/(\d+)\./)
  if (match) {
    return (
      (match[1] === 'Firefox' && +match[2] >= 65) ||
      (match[1] === 'Edge' && +match[2] >= 18) ||
      (match[1] === 'Safari' && +match[2] >= 14)
    )
  }

  // Use canvas hack for webkit-based browsers
  // Kudos to Rui Marques: https://stackoverflow.com/a/27232658/7897049
  const el = document?.createElement('canvas')
  return el?.toDataURL
    ? el.toDataURL('image/webp').indexOf('data:image/webp') === 0
    : false
}

const checkWebpSupport = () => {
  if (typeof hasWebpSupport === 'undefined') {
    hasWebpSupport = initWebpSupport()
    return hasWebpSupport
  }
  return hasWebpSupport
}

const loader = ({ src, width, quality }: ImageLoaderProps) => {
  const webP = checkWebpSupport()
  const storyblokRegex = /^(https?:)?\/\/a.storyblok.com\//
  const originalPath = src.replace(storyblokRegex, '')
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
  if (!src || src?.endsWith('.svg')) {
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
