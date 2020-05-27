import { getGlobalState } from './state/state'

function _getImageSource({ image, width, height }: { image: string, width: number, height: number }) {
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
    image: image,
    width: orig.width / 100,
    height: orig.height / 100
  })
}

export function imageServiceNoWebp(image: string, option: string = '') {
  if (image.endsWith('.svg')) {
    return image
  }
  const imageService = 'https://img2.storyblok.com/'
  const path = image.replace('//a.storyblok.com', '')
  return imageService + option + path
}

export function getOriginalImageDimensions(src: string) {
  const splitted = src.split('/')
  const [originalWidth, originalHeight] = splitted[splitted.length - 3].split('x')
  return {
    width: parseInt(originalWidth),
    height: parseInt(originalHeight)
  }
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

export function getImageAttrs({ originalSource, width = 0, height = 0, filter = '', fitInColor, smart, focalPoint }: GetImageFuncProps): { src: string, srcSet: string } {
  const originalDimensions = getOriginalImageDimensions(originalSource)
  if (originalDimensions.width < width) {
    width = originalDimensions.width
  }
  if (height && originalDimensions.height < height) {
    height = originalDimensions.height
  }
  if (fitInColor) {
    filter += `:fill(${fitInColor})`
  }
  let path = getPath(width, height)
  if (focalPoint) {
    filter += getFocalPoint(originalSource, focalPoint)
  }
  const src = imageService(originalSource, path, filter)
  const imgObj = {
    src: src,
    srcSet: src
  }
  // enable retina sourceset
  if (width <= originalDimensions.width / 2 && height <= originalDimensions.height / 2) {
    imgObj.srcSet = `${imgObj.src} 1x, ${imageService(originalSource, getPath(width * 2, height * 2), filter)} 2x`
  }

  function getPath(width: number, height: number) {
    let path = `${width || 0}x${height || 0}`
    if (fitInColor) {
      path = 'fit-in/' + path
    } else if (smart && !focalPoint) {
      path += '/smart'
    }
    return path
  }

  return imgObj
}

const  boundCoordinate = (value:number, upperBound:number) =>{
  value = Math.max(0, value);
  value = Math.min(value, upperBound);

  return Math.ceil(value);
}

const FOCAL_SQUARE_LENGTH = 100

export function getFocalPoint(src: string, focalPoint: string) {
  const { width, height } = getOriginalImageDimensions(src)
  const [focalPointXVal, focalPointYVal] = focalPoint.split('x')
  const focalPointX = parseInt(focalPointXVal)
  const focalPointY = parseInt(focalPointYVal)
  const top = boundCoordinate(
    (focalPointY / 100) * height - FOCAL_SQUARE_LENGTH / 2,
    height
  );
  const left = boundCoordinate(
    (focalPointX / 100) * width - FOCAL_SQUARE_LENGTH / 2,
    width
  );
  const bottom = boundCoordinate(
    top + FOCAL_SQUARE_LENGTH,
    height
  );
  const right = boundCoordinate(
    left + FOCAL_SQUARE_LENGTH,
    width
  );

  return `:focal(${left}x${top}:${right}x${bottom})`
}

export default function imageService(image: string, option: string = '', filter: string = '') {
  if (image.endsWith('.svg')) {
    return image
  }
  option && (option += '/')
  if (getGlobalState('hasWebpSupport')) {
    option += 'filters:format(webp)' + filter
  } else if (filter) {
    option += 'filters' + filter
  }
  return `https://img2.storyblok.com/${option}${image.split('storyblok.com')[1]}`
}
