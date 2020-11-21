import { getGlobalState } from './state/state'

export function getOriginalImageDimensions(src = '') {
  if (!src) {
    return {
      width: 0,
      height: 0
    }
  }
  const splitted = src.split('/')
  const [originalWidth, originalHeight] = splitted[splitted.length - 3].split(
    'x'
  )
  return {
    width: parseInt(originalWidth),
    height: parseInt(originalHeight)
  }
}

export function getRootImageUrl(src = '') {
  return src.replace('//a.', 'https://a.')
}

export function vercelImageService(
  image: string,
  { width, quality }: { width: number; quality?: number }
) {
  const query = new URLSearchParams()
  query.append('url', getRootImageUrl(image))
  query.append('w', `${width}`)
  query.append('q', `${quality || 75}`)
  return `/_next/image?${query.toString()}`
}

export const getVwByColCount = (count?: string | number): number => {
  const c = Number(count)
  return c && c > 0 ? Math.round(100 / c) : 100
}

export const imageCalculateWidth = (
  height: number,
  originalDimensions: { width: number; height: number }
) => {
  return Math.round(
    (height / originalDimensions.height) * originalDimensions.width
  )
}

export default function imageService(image: string, option = '', filter = '') {
  let opt = option
  if (image.endsWith('.svg')) {
    return image
  }
  opt && (opt += '/')
  if (getGlobalState('hasWebpSupport')) {
    opt += `filters:format(webp)${filter}`
  } else if (filter) {
    opt += `filters${filter}`
  }
  return `https://img2.storyblok.com/${opt}${image.split('storyblok.com')[1]}`
}

export function imageServiceNoWebp(image: string, option = '') {
  if (image.endsWith('.svg') || !option) {
    return getRootImageUrl(image)
  }
  const imageService2 = 'https://img2.storyblok.com/'
  const path = image.replace('//a.storyblok.com', '')
  return imageService2 + option + path
}

export type GetImageFuncProps = {
  originalSource: string
  width: number
  height?: number
  filter?: string
  fitInColor?: string
  smart?: boolean
  focalPoint?: string
}

export function getImageAttrs({
  originalSource,
  width = 0,
  height = 0,
  filter = '',
  fitInColor,
  smart,
  focalPoint
}: GetImageFuncProps): {
  src: string
  srcSet: string
  originalDimensions: { width: number; height: number }
} {
  const originalDimensions = getOriginalImageDimensions(originalSource)
  let dimW = width
  let dimH = height
  let filterVar = filter
  const getPath = (w: number, h: number) => {
    let path = `${w || 0}x${h || 0}`
    if (fitInColor) {
      path = `fit-in/${path}`
    } else if (smart && !focalPoint) {
      path += '/smart'
    }
    return path
  }
  if (originalDimensions.width < dimW) {
    dimW = originalDimensions.width
  }
  if (dimH && originalDimensions.height < dimH) {
    dimH = originalDimensions.height
  }
  if (fitInColor) {
    filterVar += `:fill(${fitInColor})`
  }
  const path = getPath(dimW, dimH)

  const src = imageService(originalSource, path, filter)
  const imgObj = {
    src,
    srcSet: src,
    originalDimensions
  }
  // enable retina sourceset
  if (
    dimW <= originalDimensions.width / 2 &&
    dimH <= originalDimensions.height / 2
  ) {
    imgObj.srcSet = `${imgObj.src} 1x, ${imageService(
      originalSource,
      getPath(dimW * 2, dimH * 2),
      filterVar
    )} 2x`
  }

  return imgObj
}
