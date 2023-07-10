import { Theme } from '@mui/material/styles'

export function getOriginalImageDimensions(src = '') {
  if (!src) {
    return {
      width: 0,
      height: 0
    }
  }
  const splitted = src.split('/')
  const [originalWidth, originalHeight] = src
    .split('/')
    [splitted.length - 3].split('x')
  return {
    width: parseInt(originalWidth),
    height: parseInt(originalHeight)
  }
}

// function calculateFocalPoint(originalWidth, originalHeight, focalValue) {
//   const [xPercent, yPercent] = focalValue.split('x').map(parseFloat)
//   const focalX = (xPercent / 100) * originalWidth
//   const focalY = (yPercent / 100) * originalHeight
//
//   const left = focalX - originalWidth / 2
//   const top = focalY - originalHeight / 2
//   const right = left + originalWidth
//   const bottom = top + originalHeight
//
//   const focalPoint = `:focal(${left.toFixed(0)}x${top.toFixed(
//     0
//   )}:${right.toFixed(0)}x${bottom.toFixed(0)})`
//
//   return focalPoint
// }
//
// export function getFocalPoint(src = '', focalPoint = '') {
//   const { width, height } = getOriginalImageDimensions(src)
//   return calculateFocalPoint(width, height, focalPoint)
// }

export const getRootImageUrl = (src = '') =>
  src.replace(/^(https?:)?\/\/a.storyblok./, 'https://a.storyblok.')

export const getVwByColCount = (count?: string | number): number => {
  const c = Number(count)
  return c && c > 0 ? Math.round(100 / c) : 100
}

export const imageCalculateWidth = (
  height: number,
  originalDimensions: { width: number; height: number }
) => Math.round((height / originalDimensions.height) * originalDimensions.width)

export const imageCalculateHeight = (
  width: number,
  originalImageDimensions: { width: number; height: number }
) => width * (originalImageDimensions.height / originalImageDimensions.width)

export const imageCalculateWidthHeight = (
  size: number,
  storyblokImageSource: string,
  options?: { sizeIsHeight?: boolean }
): { width: number; height: number } => {
  const originalImageDimensions =
    getOriginalImageDimensions(storyblokImageSource)
  const ratio = originalImageDimensions.height / originalImageDimensions.width
  if (ratio < 1 || options?.sizeIsHeight) {
    return {
      height: size,
      width: imageCalculateWidth(size, originalImageDimensions)
    } // make sure that image is at least width
  }
  return { width: size, height: Math.round(size * ratio) }
}

const calculatePxToVw = (absolute: number, breakpoint: number) =>
  absolute > breakpoint ? 100 : Math.round((absolute / breakpoint) * 100)

export const imageSizesOnWidthAndBreakpoints = (
  width: number,
  breakpoints: Theme['breakpoints']
) =>
  `(min-width: 0) and (max-width: ${
    breakpoints.values.sm - 1
  }px) ${calculatePxToVw(width, breakpoints.values.sm - 1)}vw, (min-width: ${
    breakpoints.values.sm
  }px) and (max-width: ${breakpoints.values.md - 1}px): ${calculatePxToVw(
    width,
    breakpoints.values.md - 1
  )}vw, ${calculatePxToVw(width, breakpoints.values.lg)}vw`

export function imageServiceNoWebp(image = '', option = '') {
  const originalPath = image.replace(/^(https?:)?\/\/a.storyblok.com\//, '')
  if (image.endsWith('.svg') || !option) {
    return 'https://a.storyblok.com/' + originalPath //getRootImageUrl(image)
  }
  return 'https://a.storyblok.com/' + originalPath + '/m/' + option
}
