import { Theme } from '@material-ui/core/styles'

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
  if (image.endsWith('.svg') || !option) {
    return getRootImageUrl(image)
  }
  const imageService2 = 'https://img2.storyblok.com/'
  const path = image.replace('//a.storyblok.com', '')
  return imageService2 + option + path
}
