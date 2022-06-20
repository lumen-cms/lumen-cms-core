import React, { FC, PropsWithChildren, useState } from 'react'
import Image, { ImageProps } from 'next/image'
import Skeleton from '@mui/material/Skeleton'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import {
  getOriginalImageDimensions,
  getRootImageUrl,
  getVwByColCount
} from '../../utils/imageServices'
import { LmImageListItemProps } from './imageListTypes'
import { COLUMN_COUNT } from '../card/cardListStyles'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'

const ImageWrap: FC<
  PropsWithChildren<{
    fitInColor?: string
    respectImgRatio?: boolean
    loaded?: boolean
  }>
> = ({ respectImgRatio, loaded, children, fitInColor }) => {
  if (!fitInColor || respectImgRatio) {
    return <>{children}</>
  }
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '100%',
        height: '100%',
        backgroundColor: fitInColor || (loaded ? '#eee' : undefined)
      }}
    >
      {children}
    </Box>
  )
}

export default function LmImageListItem({
  content,
  listProps
}: LmImageListItemProps): JSX.Element {
  const [loaded, setLoaded] = useState<boolean>(false)
  const theme = useTheme()
  // const { classes, theme } = useStyles()
  const imageSource = getRootImageUrl(content.source || '')
  const originalDimensions = getOriginalImageDimensions(content.source || '')
  const { breakpoints } = theme

  const { width } = originalDimensions
  const { height } = originalDimensions

  const respectImgRatio =
    listProps.masonry ||
    listProps.variant === 'masonry' ||
    !listProps.aspect_ratio
  const { column_count, column_count_phone, column_count_tablet } = listProps

  let imgProps: ImageProps
  if (respectImgRatio) {
    imgProps = {
      src: imageSource,
      width,
      height,
      objectFit: 'cover',
      objectPosition: 'center',
      layout: 'responsive'
    }
  } else {
    imgProps = {
      src: imageSource,
      layout: 'fill',
      objectFit: listProps.fit_in_color ? 'contain' : 'cover'
    }
  }
  const phoneVw = getVwByColCount(column_count_phone || COLUMN_COUNT.PHONE)
  const tabletVw = getVwByColCount(
    column_count_tablet || column_count || COLUMN_COUNT.TABLET
  )
  const desktopVw = getVwByColCount(column_count || COLUMN_COUNT.DESKTOP)
  imgProps.sizes = `(min-width: 0) and (max-width: ${
    breakpoints.values.sm - 1
  }px) ${phoneVw}vw, (min-width: ${breakpoints.values.sm}px) and (max-width: ${
    breakpoints.values.md - 1
  }px): ${tabletVw}vw,
            ${desktopVw}vw`

  return (
    <ImageWrap
      fitInColor={listProps.fit_in_color}
      loaded={loaded}
      respectImgRatio={respectImgRatio}
    >
      {!loaded && (
        <Skeleton
          style={{ position: 'absolute' }}
          width="100%"
          height="100%"
          variant="rectangular"
        />
      )}
      <Image
        {...imgProps}
        {...storyblokImageLoader(imageSource)}
        alt={content.alt || content.label || 'image list item'}
        onLoad={() => setLoaded(true)}
      />
      {(content.label || content.sub_title) && (
        <ImageListItemBar
          title={content.label}
          subtitle={content.sub_title}
          position={
            content.label_position || listProps.label_position || 'bottom'
          }
        />
      )}
    </ImageWrap>
  )
}
