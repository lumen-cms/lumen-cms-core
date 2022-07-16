import React, { FC, PropsWithChildren } from 'react'
import Image from 'next/future/image'
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
  }>
> = ({ respectImgRatio, children, fitInColor }) => {
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
        backgroundColor: fitInColor || undefined
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
  const phoneVw = getVwByColCount(column_count_phone || COLUMN_COUNT.PHONE)
  const tabletVw = getVwByColCount(
    column_count_tablet || column_count || COLUMN_COUNT.TABLET
  )
  const desktopVw = getVwByColCount(column_count || COLUMN_COUNT.DESKTOP)

  return (
    <ImageWrap
      fitInColor={listProps.fit_in_color}
      respectImgRatio={respectImgRatio}
    >
      <Image
        src={imageSource}
        width={width}
        height={height}
        style={{
          objectFit: listProps.fit_in_color ? 'contain' : undefined
        }}
        sizes={`(min-width: 0) and (max-width: ${
          breakpoints.values.sm - 1
        }px) ${phoneVw}vw, (min-width: ${
          breakpoints.values.sm
        }px) and (max-width: ${
          breakpoints.values.md - 1
        }px): ${tabletVw}vw, ${desktopVw}vw`}
        {...storyblokImageLoader(imageSource)}
        placeholder={'empty'}
        className={'MuiImageListItem-img'}
        alt={content.alt || content.label || 'image list item'}
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
