import { ImageLoaderProps, ImageProps } from 'next/image'

export const loader = ({ src, width, quality }: ImageLoaderProps) => {
  // Keep GIF frames and their original palette instead of resizing/re-encoding.
  if (/\.gif(?:[?#]|$)/i.test(src)) return src
  const original = new URL(src)
  const pathname = original.pathname
  // const params = Object.fromEntries(original.searchParams)

  let opts = ''
  if (width) {
    opts += `/${width}x0`
  }

  opts += `/filters:quality(${
    quality || process.env.NEXT_PUBLIC_IMAGE_QUALITY || 75
  })`
  // if (params.focalPoint) {
  //   const fPoint = getFocalPoint(src, params.focalPoint)
  //   console.log(params.focalPoint)
  //   opts += fPoint
  // }

  return `https://a.storyblok.com/${pathname}/m${opts}`
}

export const storyblokImageLoader = (
  src: string | undefined
): Partial<ImageProps> => {
  let props: Partial<ImageProps> = {}
  if (src?.indexOf('a.storyblok') !== -1) {
    props.loader = loader
  }
  if (src && /\.(?:svg|gif)(?:[?#]|$)/i.test(src)) {
    props.unoptimized = true
  }
  return props
}
