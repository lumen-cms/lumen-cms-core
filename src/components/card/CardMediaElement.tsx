import React, { FunctionComponent } from 'react'
import CardMedia from '@material-ui/core/CardMedia'
import Image from 'next/image'
import { useTheme } from '@material-ui/core/styles'
import { getRootImageUrl, getVwByColCount } from '../../utils/imageServices'
import { CardListItemProps } from './cardTypes'
import { COLUMN_COUNT } from './cardListStyles'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'

const CardMediaElement: FunctionComponent<CardListItemProps> = ({
  children,
  content,
  options
}) => {
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
        loading="lazy"
        layout="fill"
        {...(content.story_data && {
          placeholder: 'blur',
          blurDataURL: content.story_data.base64
        })}
        sizes={`(min-width: 0) and (max-width: ${
          breakpoints.values.sm - 1
        }px) ${phoneVw}vw, (min-width: ${
          breakpoints.values.sm
        }px) and (max-width: ${breakpoints.values.md - 1}px): ${tabletVw}vw,
            ${desktopVw}vw`}
        objectFit={options.image_size || 'cover'}
      />
      {children}
    </CardMedia>
  )
}
CardMediaElement.displayName = 'CardMediaElement'
export default CardMediaElement
