import Image, { ImageProps } from 'next/image'
import React from 'react'
import { imageCalculateWidthHeight } from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/imageLoader'

type LmSquareImageProps = {
  image: string
  width?: number | string
  layout?: 'responsive' | 'intrinsic' | 'fixed'
  imageProps?: Pick<
    ImageProps,
    | 'loading'
    | 'onLoad'
    | 'onClick'
    | 'priority'
    | 'objectFit'
    | 'objectPosition'
    | 'quality'
    | 'alt'
  >
}
export default function LmSquareImage({
  width,
  image,
  imageProps,
  layout
}: LmSquareImageProps): JSX.Element {
  return (
    <Image
      src={image}
      {...(image.includes('a.storyblok.com')
        ? {
            layout: layout || 'fixed',
            ...imageCalculateWidthHeight(width ? Number(width) : 40, image),
            objectFit: 'cover'
          }
        : {
            layout: 'fill',
            objectFit: 'cover'
          })}
      {...storyblokImageLoader(image)}
      {...imageProps}
    />
  )
}
