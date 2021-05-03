import Image, { ImageProps } from 'next/image'
import React from 'react'
import { imageCalculateWidthHeight } from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/imageLoader'

type LmSquareImageProps = {
  image: string
  size?: number | string
  sizeIsHeight?: boolean
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
  size,
  image,
  imageProps,
  layout,
  sizeIsHeight
}: LmSquareImageProps): JSX.Element {
  console.log(size)

  return (
    <Image
      src={image}
      {...(image.includes('a.storyblok.com')
        ? {
            layout: layout || 'fixed',
            ...imageCalculateWidthHeight(size ? Number(size) : 40, image, {
              sizeIsHeight
            }),
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
