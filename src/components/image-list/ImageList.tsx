import React, { useState } from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { LmComponentRender } from '@LmComponentRender'
import { LmCoreComponents } from '@CONFIG'
import dynamic from 'next/dynamic'
import { useImageListStyles } from './useImageListStyles'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmImageListProps } from './imageListTypes'
import { COLUMN_COUNT } from '../card/cardListStyles'

const ImageListLightbox = dynamic(() => import('./ImageListLightbox'))

export default function LmImageList({
  content
}: LmImageListProps): JSX.Element {
  const { classes, cx } = useImageListStyles()
  const [lightbox, setLightbox] = useState('')

  const gutterSize = content.column_gap ? Number(content.column_gap) : 2

  const onImageClick = (element: any) => {
    content.enable_lightbox && setLightbox(element._uid)
  }

  const body = content.body || []

  return (
    <div className="lm-imagelist__container">
      <div
        className={cx(classes.root, {
          // [gridClasses.masonry]: content.masonry,
          [classes.aspectRatio]: !!(content.aspect_ratio && !content.masonry),
          [`ratio-${content.aspect_ratio}`]: !!(
            content.aspect_ratio && !content.masonry
          ),
          'with-lightbox': content.enable_lightbox
        })}
      >
        <ImageList
          rowHeight="auto"
          gap={gutterSize}
          variant={content.masonry ? 'masonry' : undefined}
          sx={{
            ...(!content.masonry
              ? {
                  gridTemplateColumns: {
                    xs: `repeat(${
                      content.column_count_phone ||
                      content.column_count ||
                      COLUMN_COUNT.PHONE
                    }, 1fr)!important`,
                    sm: `repeat(${
                      content.column_count_tablet ||
                      content.column_count ||
                      COLUMN_COUNT.TABLET
                    }, 1fr)!important`,
                    lg: `repeat(${
                      content.column_count || COLUMN_COUNT.DESKTOP
                    }, 1fr)!important`
                  }
                }
              : {
                  columnCount: {
                    xs: `${
                      content.column_count_phone ||
                      content.column_count ||
                      COLUMN_COUNT.PHONE_MASONRY
                    }!important`,
                    sm: `${
                      content.column_count_tablet ||
                      content.column_count ||
                      COLUMN_COUNT.TABLET
                    }!important`,
                    lg: `${
                      content.column_count || COLUMN_COUNT.DESKTOP
                    }!important`
                  }
                })
          }}
          // cols={4}
          className={cx(classes.rootGrid)}
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
