import React from 'react'
import Image from './Image'
import AspectImage from './AspectImage'
import ImageSvg from './ImageSvg'
import { LmImageProps } from './imageTypes'

export function LmImage({ content, onClick }: LmImageProps): JSX.Element {
  const isSvgImage = content.source?.endsWith('.svg')
  if (isSvgImage) {
    return (
      <ImageSvg
        content={content}
        onClick={() => {
          onClick && onClick()
        }}
      />
    )
  }
  if (!content.height && !content.width) {
    return (
      <AspectImage
        content={content}
        onClick={() => {
          onClick && onClick()
        }}
      />
    )
  }
  return (
    <Image
      content={content}
      onClick={() => {
        onClick && onClick()
      }}
    />
  )
}
