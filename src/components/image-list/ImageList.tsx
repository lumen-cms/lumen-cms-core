import React, { useState } from 'react'
import ImageList, { ImageListProps } from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import clsx from 'clsx'
import { LmComponentRender } from '@LmComponentRender'
import { LmCoreComponents } from '@CONFIG'
import dynamic from 'next/dynamic'
import { useGridListStyles } from '../card/cardListStyles'
import { useImageListStyles } from './useImageListStyles'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmImageListProps } from './imageListTypes'

const ImageListLightbox = dynamic(() => import('./ImageListLightbox'))

export default function LmImageList({
  content
}: LmImageListProps): JSX.Element {
  const { classes } = useImageListStyles()

  const gridClasses = useGridListStyles({
    columnCount: content.column_count,
    columnCountPhone: content.column_count_phone,
    columnCountTablet: content.column_count_tablet,
    isMasonry: !!content.masonry
  }).classes
  const [lightbox, setLightbox] = useState('')

  const gutterSize = content.column_gap ? Number(content.column_gap) : 2

  const onImageClick = (element: any) => {
    content.enable_lightbox && setLightbox(element._uid)
  }

  const body = content.body || []
  const gridListProps: Partial<ImageListProps> = {
    gap: gutterSize
  }
  if (content.masonry) {
    gridListProps.gap = 0
    gridListProps.style = {
      columnGap: `${gutterSize}px`
    }
  }

  return (
    <div className="lm-imagelist__container">
      <div
        className={clsx(classes.root, {
          [gridClasses.masonry]: content.masonry,
          [classes.aspectRatio]: content.aspect_ratio && !content.masonry,
          [`ratio-${content.aspect_ratio}`]:
            content.aspect_ratio && !content.masonry,
          'with-lightbox': content.enable_lightbox
        })}
      >
        <ImageList
          rowHeight="auto"
          className={clsx(
            content.masonry ? gridClasses.rootMasonry : gridClasses.root,
            classes.rootGrid
          )}
          {...gridListProps}
        >
          {body.map((item, i) => {
            const btnProps: any =
              item.link?.cached_url && !content.enable_lightbox
                ? {
                    ...getLinkAttrs(item.link as LinkType, {
                      openExternal: !!item.open_external
                    }),
                    naked: true,
                    component: LmCoreComponents.lm_link_render
                  }
                : {}
            return (
              <ImageListItem
                key={item._uid}
                {...btnProps}
                style={{
                  padding: !content.masonry ? `${gutterSize}px` : undefined,
                  marginBottom: content.masonry ? `${gutterSize}px` : undefined
                }}
                onClick={(ev: any) =>
                  onImageClick({ _uid: item._uid, count: i, ...ev })
                }
              >
                <LmComponentRender content={item} listProps={content} />
              </ImageListItem>
            )
          })}
        </ImageList>
      </div>
      {lightbox && (
        <ImageListLightbox
          elements={body}
          lightbox={lightbox}
          setLightbox={setLightbox}
          onImageClick={onImageClick}
        />
      )}
    </div>
  )
}
