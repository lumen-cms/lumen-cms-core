import React from 'react'
import Image from './Image'
import ImageSvg from './ImageSvg'
import { LmImageProps } from './imageTypes'

export function LmImage({ content }: LmImageProps): JSX.Element {
  const isSvgImage = content.source && content.source.endsWith('.svg')
  if (isSvgImage) {
    return <ImageSvg content={content} />
  }
  return <Image content={content} />
}
