import React, { useState } from 'react'
import GridList, { GridListProps } from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import clsx from 'clsx'
import { useWindowSize } from '@react-hook/window-size'
import { LmComponentRender } from '@LmComponentRender'
import { LmCoreComponents } from '@CONFIG'
import { useInView } from 'react-intersection-observer'
import ImageListLightbox from './ImageListLightbox'
import { useGridListStyles } from '../card/cardListStyles'
import { useImageListStyles } from './useImageListStyles'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmImageListProps } from './imageListTypes'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'

export default function LmImageList({
  content
}: LmImageListProps): JSX.Element {
  const classes = useImageListStyles()
  const [width, height] = useWindowSize()
  const [inViewRef, inView] = useInView(intersectionDefaultOptions)

  const gridClasses = useGridListStyles({
    columnCount: content.column_count,
    columnCountPhone: content.column_count_phone,
    columnCountTablet: content.column_count_tablet,
    isMasonry: !!content.masonry
  })
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
    <div className="lm-imagelist__container" ref={inViewRef}>
      <div
        // // style={{
        // //   padding: `${gutterSize}px`
        // {/*}}*/}
        className={clsx(classes.root, {
          [gridClasses.masonry]: content.masonry,
          [classes.aspectRatio]: content.aspect_ratio && !content.masonry,
          [`ratio-${content.aspect_ratio}`]: content.aspect_ratio,
          'with-lightbox': content.enable_lightbox,
          [classes.defaultImg]: !content.masonry && !content.aspect_ratio
        })}
      >
        <GridList
          cellHeight="auto"
          className={clsx(gridClasses.gridList, classes.rootGrid)}
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
              <GridListTile
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
                <LmComponentRender
                  content={item}
                  listProps={content}
                  inView={inView}
                />
              </GridListTile>
            )
          })}
        </GridList>
      </div>
      {lightbox && (
        <ImageListLightbox
          elements={body}
          lightbox={lightbox}
          setLightbox={setLightbox}
          onImageClick={onImageClick}
          width={width}
          height={height}
        />
      )}
    </div>
  )
}
