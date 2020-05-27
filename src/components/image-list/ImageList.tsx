import React, { RefObject, useState } from 'react'
import ImageListLightbox from './ImageListLightbox'
import { ImageListStoryblok } from '../../typings/generated/components-schema'
import { useWindowDimensions } from '../provider/WindowDimensionsProvider'
import GridList, { GridListProps } from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import clsx from 'clsx'
import { useGridListStyles } from '../card/cardListStyles'
import { useImageListStyles } from './useImageListStyles'
import { useAppContext } from '../provider/AppProvider'

export type LmImageListProps = {
  content: ImageListStoryblok
}

export function LmImageList({ content }: LmImageListProps): JSX.Element {
  const classes = useImageListStyles()
  const { ComponentRender } = useAppContext()

  const gridClasses = useGridListStyles({
    columnCount: content.column_count,
    columnCountPhone: content.column_count_phone,
    columnCountTablet: content.column_count_tablet,
    isMasonry: !!content.masonry
  })
  const dimensions = useWindowDimensions()
  const containerRef: RefObject<HTMLDivElement> = React.createRef()
  const [lightbox, setLightbox] = useState('')

  let gutterSize = content.column_gap ? Number(content.column_gap) : 2

  function onImageClick(element: any) {
    // open lightbox
    content.enable_lightbox && setLightbox(element._uid)
  }


  const body = content.body || []
  let gridListProps: GridListProps = {
    spacing: gutterSize
    // cols: columnCount
  }
  if (content.masonry) {
    gridListProps.spacing = 0
    delete gridListProps.cols
    gridListProps.style = {
      // columnCount: columnCount,
      columnGap: `${gutterSize}px`
    }
  }

  return (
    <div className="lm-imagelist__container">
      <div ref={containerRef}
           style={{
             padding: gutterSize + 'px'
           }}
           className={clsx(classes.root, {
             [classes.masonry]: content.masonry,
             [classes.aspectRatio]: content.aspect_ratio && !content.masonry,
             ['ratio-' + content.aspect_ratio]: content.aspect_ratio,
             'with-lightbox': content.enable_lightbox
           })}>
        <GridList cellHeight={'auto'}
                  className={gridClasses.gridList}
                  {...gridListProps}
        >
          {body.map((item, i) => (
            <GridListTile key={`${item.component}_${i}`} style={{
              padding: !content.masonry ? `${gutterSize}px` : undefined,
              marginBottom: content.masonry ? `${gutterSize}px` : undefined
            }}
                          onClick={(ev: any) => onImageClick({ _uid: item._uid, count: i, ...ev })}>
              {ComponentRender({ content: item, listProps: content })}
            </GridListTile>
          ))}
        </GridList>
      </div>
      {lightbox && ImageListLightbox({
        elements: body,
        lightbox,
        setLightbox,
        dimensions,
        onImageClick,
        className: classes.lightbox
      })}
    </div>
  )
}
