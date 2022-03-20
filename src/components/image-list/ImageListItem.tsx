import React, { FC, useState } from 'react'
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
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%'
  }
})

export default function LmImageListItem({
  content,
  listProps
}: LmImageListItemProps): JSX.Element {
  const [loaded, setLoaded] = useState<boolean>(false)
  const { classes, theme } = useStyles()
  const imageSource = getRootImageUrl(content.source || '')
  const originalDimensions = getOriginalImageDimensions(content.source || '')
  const { breakpoints } = theme

  const { width } = originalDimensions
  const { height } = originalDimensions

  const respectImgRatio = listProps.masonry || !listProps.aspect_ratio
  const { column_count, column_count_phone, column_count_tablet } = listProps

  const phoneVw = getVwByColCount(column_count_phone || COLUMN_COUNT.PHONE)
  const tabletVw = getVwByColCount(
    column_count_tablet || column_count || COLUMN_COUNT.TABLET
  )
  const desktopVw = getVwByColCount(column_count || COLUMN_COUNT.DESKTOP)
  // console.log('inside of masonry', listProps)
  let imgProps: ImageProps = {
    src: imageSource,
    layout: 'fill',
    objectFit: listProps.fit_in_color ? 'contain' : 'cover'
  }
  if (respectImgRatio) {
    imgProps = {
      src: imageSource,
      width,
      height,
      layout: 'intrinsic'
    }
  }

  const ImageWrap: FC =
    !listProps.fit_in_color || respectImgRatio
      ? ({ children }) => <>{children}</>
      : ({ children }) => (
          <div
            className={classes.root}
            style={{
              backgroundColor:
                listProps.fit_in_color || loaded ? '#eee' : undefined
            }}
          >
            {children}
          </div>
        )

  return (
    <ImageWrap>
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
        sizes={`(min-width: 0) and (max-width: ${
          breakpoints.values.sm - 1
        }px) ${phoneVw}vw, (min-width: ${
          breakpoints.values.sm
        }px) and (max-width: ${breakpoints.values.md - 1}px): ${tabletVw}vw,
            ${desktopVw}vw`}
      />
      {(content.label || content.sub_title) && (
        <ImageListItemBar
          title={content.label}
          subtitle={content.sub_title}
          position={listProps.label_position || 'bottom'}
        />
      )}
    </ImageWrap>
  )
}
