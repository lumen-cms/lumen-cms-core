import Image from 'next/image'
import React from 'react'
import { imageCalculateWidthHeight } from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/imageLoader'

type LmSquareImageProps = {
  image: string
  width?: number | string
}
export default function LmSquareImage({
  width,
  image
}: LmSquareImageProps): JSX.Element {
  return (
    <Image
      src={image}
      {...(image.includes('a.storyblok.com')
        ? {
            layout: 'fixed',
            ...imageCalculateWidthHeight(width ? Number(width) : 40, image),
            objectFit: 'cover'
          }
        : {
            layout: 'fill',
            objectFit: 'cover'
          })}
      {...storyblokImageLoader(image)}
    />
  )
}
