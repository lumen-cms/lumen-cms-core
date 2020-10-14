import { IntersectionOptions } from 'react-intersection-observer'

export const intersectionDefaultOptions: IntersectionOptions = {
  triggerOnce: true,
  rootMargin: '400px 0px 400px 0px'
}

export const intersectionImageOptions: IntersectionOptions = {
  ...intersectionDefaultOptions,
  rootMargin: '800px 0px 800px 0px'
}

export const intersectionIframeOptions: IntersectionOptions = {
  ...intersectionDefaultOptions,
  rootMargin: '150px 0px 150px 0px'
}
