import Image, { ImageProps } from 'next/image'
import React from 'react'
import {
  getRootImageUrl,
  imageCalculateWidthHeight
} from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'

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
  // src={getRootImageUrl(image)}
  return (
    <Image
      src={getRootImageUrl(image)}
      {...storyblokImageLoader(image)}
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
      {...imageProps}
    />
  )
}
