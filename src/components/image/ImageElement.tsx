import React from 'react'
import Image from './Image'
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
  return (
    <Image
      content={content}
      onClick={() => {
        onClick && onClick()
      }}
    />
  )
}
