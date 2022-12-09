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
  base64?: string
  imageProps?: Pick<
    ImageProps,
    | 'loading'
    | 'onLoad'
    | 'onClick'
    | 'priority'
    | 'quality'
    | 'alt'
    | 'className'
    | 'style'
  >
}

export default function LmSquareImage({
  size,
  image,
  imageProps,
  sizeIsHeight
}: LmSquareImageProps): JSX.Element {
  return (
    <Image
      src={getRootImageUrl(image)}
      {...storyblokImageLoader(image)}
      {...(image.includes('a.storyblok.com')
        ? {
            ...imageCalculateWidthHeight(size ? Number(size) : 40, image, {
              sizeIsHeight
            }),
            style: {
              objectFit: 'cover',
              width: '100%',
              height: 'auto'
            }
          }
        : {
            fill: true,
            style: {
              objectFit: 'cover'
            }
          })}
      {...imageProps}
      alt={imageProps?.alt || 'website image'}
    />
  )
}
