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
  base64?: string
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
    | 'className'
  >
}

export default function LmSquareImage({
  size,
  image,
  imageProps,
  layout,
  sizeIsHeight,
  base64
}: LmSquareImageProps): JSX.Element {
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
      {...(base64 && {
        placeholder: 'blur',
        blurDataURL: base64
      })}
    />
  )
}
