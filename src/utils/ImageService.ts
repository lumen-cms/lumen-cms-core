import { Theme } from '@material-ui/core'
import { getGlobalState } from './state/state'

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

export const getRootImageUrl = (src = '') => src.replace('//a.', 'https://a.')

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
  currentWidth: number,
  breakpoints: Theme['breakpoints']
) =>
  `(min-width: 0) and (max-width: ${
    breakpoints.values.sm - 1
  }px) ${calculatePxToVw(
    currentWidth,
    breakpoints.values.sm - 1
  )}vw, (min-width: ${breakpoints.values.sm}px) and (max-width: ${
    breakpoints.values.md - 1
  }px): ${calculatePxToVw(
    currentWidth,
    breakpoints.values.md - 1
  )}vw, ${calculatePxToVw(currentWidth, breakpoints.values.lg)}vw`

export function imageService(image: string, option = '', filter = '') {
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
