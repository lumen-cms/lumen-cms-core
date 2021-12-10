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
const blurred =
  'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAeEAABBQACAwAAAAAAAAAAAAADAAECBBEFBwgiYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCu8U6AeT63u2LUrDEblDQwFggY40B56wkzb9zUREH/2Q=='

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
      placeholder={'blur'}
      blurDataURL={base64 || blurred}
    />
  )
}
