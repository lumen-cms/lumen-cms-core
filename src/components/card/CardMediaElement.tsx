import React, { FunctionComponent, PropsWithChildren } from 'react'
import CardMedia from '@mui/material/CardMedia'
import Image from 'next/future/image'
import { useTheme } from '@mui/material/styles'
import { getRootImageUrl, getVwByColCount } from '../../utils/imageServices'
import { CardListItemProps } from './cardTypes'
import { COLUMN_COUNT } from './cardListStyles'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'
import { ImageDataUriFallback } from '../image/ImageDataUri'

const CardMediaElement: FunctionComponent<
  PropsWithChildren<CardListItemProps>
> = ({ children, content, options }) => {
  const { breakpoints } = useTheme()

  const { column_count, column_count_phone, column_count_tablet } = options

  const phoneVw = getVwByColCount(column_count_phone || COLUMN_COUNT.PHONE)
  const tabletVw = getVwByColCount(
    column_count_tablet || column_count || COLUMN_COUNT.TABLET
  )
  const desktopVw = getVwByColCount(column_count || COLUMN_COUNT.DESKTOP)
  return (
    <CardMedia
      style={{
        color: options.variant?.includes('font_white') ? 'white' : 'inherit',
        position: 'relative',
        margin: options.image_margin ? options.image_margin : undefined
      }}
    >
      <Image
        src={getRootImageUrl(content.image)}
        {...storyblokImageLoader(content.image)}
        fill
        placeholder={'blur'}
        blurDataURL={ImageDataUriFallback}
        sizes={`(min-width: 0) and (max-width: ${
          breakpoints.values.sm - 1
        }px) ${phoneVw}vw, (min-width: ${
          breakpoints.values.sm
        }px) and (max-width: ${breakpoints.values.md - 1}px): ${tabletVw}vw,
            ${desktopVw}vw`}
        alt={'card image'}
        style={{
          objectFit: options.image_size || 'cover'
        }}
      />
      {children}
    </CardMedia>
  )
}
CardMediaElement.displayName = 'CardMediaElement'
export default CardMediaElement
