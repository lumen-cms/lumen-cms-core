import React, { FunctionComponent } from 'react'
import CardMedia from '@material-ui/core/CardMedia'
import Image from 'next/image'
import { useTheme } from '@material-ui/core/styles'
import {
  getImageAttrs,
  getOriginalImageDimensions
} from '../../utils/ImageService'
import { CardListItemProps } from './cardTypes'

const getVwByColCount = (count?: string): number => {
  const c = Number(count)
  return c && c > 0 ? Math.round(100 / c) : 100
}
const CardMediaElement: FunctionComponent<CardListItemProps> = ({
  children,
  content,
  options
}) => {
  const imageSource = content.image
  const imageSize = options.image_size
  const { breakpoints } = useTheme()
  const storyblokImage = imageSource?.replace('//a', 'https://img2')
  const originalDimensions = getOriginalImageDimensions(imageSource || '')
  const imageAttrs = imageSource
    ? getImageAttrs({
        originalSource: imageSource,
        width: originalDimensions.width,
        height: originalDimensions.height
      })
    : undefined
  const { column_count, column_count_phone, column_count_tablet } = options

  const phoneVw = getVwByColCount(column_count_phone)
  const tabletVw = getVwByColCount(column_count_tablet || column_count)
  const desktopVw = getVwByColCount(column_count)

  return (
    <>
      <CardMedia
        style={{
          color: options.variant?.includes('font_white') ? 'white' : 'inherit',
          backgroundSize: imageSize || 'cover'
        }}
      >
        <Image
          src={imageAttrs?.src || storyblokImage || ''}
          loading="lazy"
          layout="fill"
          sizes={`(min-width: 0) and (max-width: ${
            breakpoints.values.sm - 1
          }px) ${phoneVw}vw, (min-width: ${
            breakpoints.values.sm
          }px) and (max-width: ${breakpoints.values.md - 1}px): ${tabletVw}vw,
            ${desktopVw}vw`}
        />
        {children}
      </CardMedia>
    </>
  )
}
CardMediaElement.displayName = 'CardMediaElement'
export default CardMediaElement
