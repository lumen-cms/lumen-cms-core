import React from 'react'
import Image from './Image'
import ImageSvg from './ImageSvg'
import { LmImageProps } from './imageTypes'

export function LmImage({ content, onClick }: LmImageProps): JSX.Element {
  const isSvgImage = content.source?.endsWith('.svg')
  const containerProps: Partial<LmImageProps> = {}
  if (onClick) {
    containerProps.onClick = () => onClick()
  }
  if (isSvgImage) {
    return <ImageSvg content={content} {...containerProps} />
  }
  return <Image content={content} {...containerProps} />
}
