import { ImageLoaderProps, ImageProps } from 'next/image'

export const loader = ({ src, width, quality }: ImageLoaderProps) => {
  const originalPath = src.replace(/^(https?:)?\/\/a.storyblok.com\//, '')
  let opts = ''
  if (width) {
    opts += `/${width}x0`
  }

  opts += `/filters:quality(${
    quality || process.env.NEXT_PUBLIC_IMAGE_QUALITY || 75
  })`

  return `https://a.storyblok.com/${originalPath}/m${opts}`
}

export const storyblokImageLoader = (
  src: string | undefined
): Partial<ImageProps> => {
  return src?.endsWith('.svg')
    ? {
        unoptimized: true
      }
    : {}
}
// false && src?.indexOf('a.storyblok') !== -1
//   ? {
//       loader
//     }
//   : {}
