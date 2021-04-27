import React, { FunctionComponent, useState } from 'react'
import CardMedia from '@material-ui/core/CardMedia'
import Image from 'next/image'
import { useTheme } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import { getVwByColCount } from '../../utils/imageServices'
import { CardListItemProps } from './cardTypes'
import { COLUMN_COUNT } from './cardListStyles'
import { storyblokImageLoader } from '../../utils/imageLoader'

const CardMediaElement: FunctionComponent<CardListItemProps> = ({
  children,
  content,
  options
}) => {
  const [loaded, setLoaded] = useState<boolean>(false)
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
        position: 'relative'
      }}
    >
      {!loaded && (
        <Skeleton
          style={{ position: 'absolute' }}
          width="100%"
          height="100%"
          variant="rect"
        />
      )}
      <Image
        {...storyblokImageLoader(content.image)}
        src={content.image || ''}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        layout="fill"
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
