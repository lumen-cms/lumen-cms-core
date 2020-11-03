import { getGlobalState } from './state/state'

const boundCoordinate = (value: number, upperBound: number) => {
  const v: number = Math.min(value, upperBound)

  return Math.ceil(v)
}

export function getOriginalImageDimensions(src: string) {
  const splitted = src.split('/')
  const [originalWidth, originalHeight] = splitted[splitted.length - 3].split(
    'x'
  )
  return {
    width: parseInt(originalWidth),
    height: parseInt(originalHeight)
  }
}

export const getFocalPoint = (src: string, focalPoint: string) => {
  const { width, height } = getOriginalImageDimensions(src)
  const FOCAL_SQUARE_LENGTH = 100
  const [focalPointXVal, focalPointYVal] = focalPoint.split('x')
  const focalPointX = parseInt(focalPointXVal)
  const focalPointY = parseInt(focalPointYVal)
  const top = boundCoordinate(
    (focalPointY / 100) * height - FOCAL_SQUARE_LENGTH / 2,
    height
  )
  const left = boundCoordinate(
    (focalPointX / 100) * width - FOCAL_SQUARE_LENGTH / 2,
    width
  )
  const bottom = boundCoordinate(top + FOCAL_SQUARE_LENGTH, height)
  const right = boundCoordinate(left + FOCAL_SQUARE_LENGTH, width)

  return `:focal(${left}x${top}:${right}x${bottom})`
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

function _getImageSource({
  image,
  width,
  height
}: {
  image: string
  width: number
  height: number
}) {
  let path = ''
  if (width && height) {
    path = `${parseInt(String(width))}x${parseInt(String(height))}`
  }
  path += '/smart'
  return imageService(image, path, '')
}

export function getPreviewImageSource(image: string) {
  const orig = getOriginalImageDimensions(image)
  return _getImageSource({
    image,
    width: orig.width / 100,
    height: orig.height / 100
  })
}

export function imageServiceNoWebp(image: string, option = '') {
  if (image.endsWith('.svg') || !option) {
    return image
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
  if (focalPoint) {
    filterVar += getFocalPoint(originalSource, focalPoint)
  }
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
