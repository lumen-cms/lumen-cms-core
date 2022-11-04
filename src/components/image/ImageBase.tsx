import {
  getOriginalImageDimensions,
  getRootImageUrl
} from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'
import Image from 'next/image'
import React, { CSSProperties } from 'react'
import { AspectRatio } from 'react-aspect-ratio'

type ImageBaseProps = {
  src: string
  alt?: string
  respectRatio?: boolean
  style?: CSSProperties
}

export function ImageBase({ src, alt, respectRatio, style }: ImageBaseProps) {
  const { width, height } = getOriginalImageDimensions(src)

  if (respectRatio) {
    return (
      <AspectRatio ratio={width / height}>
        <Image
          alt={alt || `image url ${src}`}
          src={getRootImageUrl(src)}
          width={width}
          height={height}
          style={{
            width: '100%',
            height: 'auto',
            ...style
          }}
          {...storyblokImageLoader(src)}
        />
      </AspectRatio>
    )
  }
  return (
    <Image
      alt={alt || `image url ${src}`}
      src={getRootImageUrl(src)}
      width={width}
      height={height}
      style={{
        width: '100%',
        height: 'auto',
        ...style
      }}
      {...storyblokImageLoader(src)}
    />
  )
}
