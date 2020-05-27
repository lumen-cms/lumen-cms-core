import React from 'react'
import { ImageStoryblok } from '../../typings/generated/components-schema'
import Image from './Image'
import ImageSvg from './ImageSvg'

export type LmImageProps = { content: ImageStoryblok }

export function LmImage({ content }: LmImageProps): JSX.Element {
  const isSvgImage = content.source && content.source.endsWith('.svg')
  if (isSvgImage) {
    return <ImageSvg content={content} />
  }
  return <Image content={content} />
}


