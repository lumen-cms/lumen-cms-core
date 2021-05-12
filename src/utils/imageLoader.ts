import { ImageLoaderProps, ImageProps } from 'next/image'

let hasWebpSupport: boolean | undefined

const browserDet = (): { name: string; version: number } => {
  const ua = navigator.userAgent
  let tem
  let M =
    ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) ||
    []
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || []
    return {
      name: 'ie',
      version: tem[1] ? Number(tem[1]) : 0
    }
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/)
    if (tem != null) {
      const x = tem.slice(1)
      return {
        name: x[0].replace('OPR', 'Opera'),
        version: x[1] ? Number(x[1]) : 0
      }
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
  // eslint-disable-next-line no-cond-assign
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1])
  return {
    name: M[0].toLowerCase(),
    version: Number(M[1])
  }
}

const initWebpSupport = () => {
  // https://github.com/ihordiachenko/supports-webp-sync
  // Check FF, Edge by user agent
  if (typeof navigator === 'undefined') {
    return true // in nodejs we set true
  }
  const { name, version } = browserDet()
  if (name === 'ie') {
    return false
  }
  if (
    (name === 'safari' && Number(version) >= 14) ||
    (name === 'firefox' && Number(version) >= 14) ||
    (name === 'edge' && Number(version) >= 18)
  ) {
    return true
  }

  // Use canvas hack for webkit-based browsers
  // Kudos to Rui Marques: https://stackoverflow.com/a/27232658/7897049
  const el = document?.createElement('canvas')
  const canWebp = el?.toDataURL
    ? el.toDataURL('image/webp').indexOf('data:image/webp') === 0
    : false
  return canWebp
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
