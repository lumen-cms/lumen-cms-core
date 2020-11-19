import React, { useState } from 'react'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Image from 'next/image'
import { useTheme } from '@material-ui/core/styles'
import {
  getImageAttrs,
  getOriginalImageDimensions,
  getVwByColCount
} from '../../utils/ImageService'
import { LmImageListItemProps } from './imageListTypes'
import { COLUMN_COUNT } from '../card/cardListStyles'

export default function LmImageListItem(
  props: LmImageListItemProps
): JSX.Element {
  const [loaded, setLoaded] = useState<boolean>(false)
  const { content, listProps } = props
  const imageSource = content.source
  const originalDimensions = getOriginalImageDimensions(imageSource || '')
  const { breakpoints } = useTheme()

  const { width } = originalDimensions
  const { height } = originalDimensions

  const respectImgRatio =
    listProps.masonry || !listProps.aspect_ratio || !listProps.image_crop
  const imageAttrs = getImageAttrs({
    originalSource: imageSource || '',
    width,
    height,
    fitInColor: listProps.fit_in_color
  })

  const { column_count, column_count_phone, column_count_tablet } = listProps

  const phoneVw = getVwByColCount(column_count_phone || COLUMN_COUNT.PHONE)
  const tabletVw = getVwByColCount(
    column_count_tablet || column_count || COLUMN_COUNT.TABLET
  )
  const desktopVw = getVwByColCount(column_count || COLUMN_COUNT.DESKTOP)
  if (!respectImgRatio) {
    return (
      <div className="image-list-item-wrap" style={{}}>
        <Image
          src={imageAttrs.src}
          width={width}
          height={height}
          alt={content.alt || content.label || 'image list item'}
          onLoad={() => setLoaded(true)}
          layout="intrinsic"
          sizes={`(min-width: 0) and (max-width: ${
            breakpoints.values.sm - 1
          }px) ${phoneVw}vw, (min-width: ${
            breakpoints.values.sm
          }px) and (max-width: ${breakpoints.values.md - 1}px): ${tabletVw}vw,
            ${desktopVw}vw`}
        />
        {(content.label || content.sub_title) && (
          <GridListTileBar
            title={content.label}
            subtitle={content.sub_title}
            titlePosition={listProps.label_position || 'bottom'}
          />
        )}
      </div>
    )
  }

  return (
    <div className="image-list-item-wrap">
      <Image
        src={imageAttrs.src}
        alt={content.alt || content.label || 'image list item'}
        onLoad={() => setLoaded(true)}
        layout="fill"
        sizes={`(min-width: 0) and (max-width: ${
          breakpoints.values.sm - 1
        }px) ${phoneVw}vw, (min-width: ${
          breakpoints.values.sm
        }px) and (max-width: ${breakpoints.values.md - 1}px): ${tabletVw}vw,
            ${desktopVw}vw`}
        objectFit="cover"
      />
      {(content.label || content.sub_title) && (
        <GridListTileBar
          title={content.label}
          subtitle={content.sub_title}
          titlePosition={listProps.label_position || 'bottom'}
        />
      )}
    </div>
  )
}
