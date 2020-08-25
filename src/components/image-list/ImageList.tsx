import React, { RefObject, useState } from 'react'
import GridList, { GridListProps } from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import clsx from 'clsx'
import ImageListLightbox from './ImageListLightbox'
import { ImageListStoryblok } from '../../typings/generated/components-schema'
import { useGridListStyles } from '../card/cardListStyles'
import { useImageListStyles } from './useImageListStyles'
import { useAppContext } from '../provider/context/AppContext'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'

export type LmImageListProps = {
  content: ImageListStoryblok
}

export function LmImageList({ content }: LmImageListProps): JSX.Element {
  const classes = useImageListStyles()
  const { ComponentRender, LinkRender } = useAppContext()

  const gridClasses = useGridListStyles({
    columnCount: content.column_count,
    columnCountPhone: content.column_count_phone,
    columnCountTablet: content.column_count_tablet,
    isMasonry: !!content.masonry
  })
  const containerRef: RefObject<HTMLDivElement> = React.createRef()
  const [lightbox, setLightbox] = useState('')

  const gutterSize = content.column_gap ? Number(content.column_gap) : 2

  function onImageClick(element: any) {
    // open lightbox
    content.enable_lightbox && setLightbox(element._uid)
  }

  const body = content.body || []
  const gridListProps: GridListProps = {
    spacing: gutterSize
  }
  if (content.masonry) {
    gridListProps.spacing = 0
    gridListProps.style = {
      // columnCount: columnCount,
      columnGap: `${gutterSize}px`
    }
  }

  return (
    <div className="lm-imagelist__container">
      <div
        ref={containerRef}
        style={{
          padding: `${gutterSize}px`
        }}
        className={clsx(classes.root, {
          [gridClasses.masonry]: content.masonry,
          [classes.aspectRatio]: content.aspect_ratio && !content.masonry,
          [`ratio-${content.aspect_ratio}`]: content.aspect_ratio,
          'with-lightbox': content.enable_lightbox
        })}
      >
        <GridList
          cellHeight="auto"
          className={gridClasses.gridList}
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
                    component: LinkRender
                  }
                : {}
            return (
              <GridListTile
                key={`${item.component}_${i}`}
                {...btnProps}
                style={{
                  padding: !content.masonry ? `${gutterSize}px` : undefined,
                  marginBottom: content.masonry ? `${gutterSize}px` : undefined
                }}
                onClick={(ev: any) =>
                  onImageClick({ _uid: item._uid, count: i, ...ev })
                }
              >
                {ComponentRender({ content: item, listProps: content })}
              </GridListTile>
            )
          })}
        </GridList>
      </div>
      {lightbox &&
        ImageListLightbox({
          elements: body,
          lightbox,
          setLightbox,
          onImageClick,
          className: classes.lightbox
        })}
    </div>
  )
}
