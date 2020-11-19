import React, { FunctionComponent } from 'react'
import CardMedia from '@material-ui/core/CardMedia'
import Image from 'next/image'
import { useTheme } from '@material-ui/core/styles'
import {
  getImageAttrs,
  getOriginalImageDimensions, getVwByColCount,
} from '../../utils/ImageService'
import { CardListItemProps } from './cardTypes'
import { COLUMN_COUNT } from './cardListStyles'

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

  const phoneVw = getVwByColCount(column_count_phone || COLUMN_COUNT.PHONE)
  const tabletVw = getVwByColCount(
    column_count_tablet || column_count || COLUMN_COUNT.TABLET
  )
  const desktopVw = getVwByColCount(column_count || COLUMN_COUNT.DESKTOP)
  console.log(imageSize)
  return (
    <>
      <CardMedia
        style={{
          color: options.variant?.includes('font_white') ? 'white' : 'inherit',
          backgroundSize: imageSize || 'cover',
          position: 'relative'
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
          objectFit="cover"
        />
        {children}
      </CardMedia>
    </>
  )
}
CardMediaElement.displayName = 'CardMediaElement'
export default CardMediaElement
