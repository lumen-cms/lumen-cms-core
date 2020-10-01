import React, { useState } from 'react'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import { useInView } from 'react-intersection-observer'
import Skeleton from '@material-ui/lab/Skeleton'
import { getImageAttrs } from '../../utils/ImageService'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { LmImageListItemProps } from './imageListTypes'

export default function LmImageListItem(
  props: LmImageListItemProps
): JSX.Element {
  const { content, listProps } = props
  const [inViewRef, inView, currentRef] = useInView(intersectionDefaultOptions)
  const [loaded, setLoaded] = useState<boolean>(false)
  // const width = listProps.width
  let imageProps: {
    src?: string
    srcSet?: string
    width?: number | string
    height?: number | string
  } = {}

  if (inView && content.source && currentRef?.target) {
    // if (listProps.image_crop && !listProps.masonry /*|| (!listProps.masonry && !listProps.fit_in_color)*/) {
    //   height = listProps.height
    // }
    const tile = currentRef.target.closest('.MuiGridListTile-root')
    if (tile) {
      let width = tile?.clientWidth
      let height = tile?.clientHeight

      width = Math.ceil(width)
      const respectImgRatio =
        listProps.masonry || !listProps.aspect_ratio || !listProps.image_crop
      height = respectImgRatio ? 0 : height && Math.ceil(height)
      const imgSrc = getImageAttrs({
        originalSource: content.source,
        width,
        height,
        smart: listProps.image_crop === 'smart',
        fitInColor: listProps.fit_in_color
      })
      imageProps = {
        src: imgSrc.src,
        srcSet: imgSrc.srcSet,
        width: width || undefined,
        height: height || undefined
      }
    }
  }

  function onLoad() {
    setLoaded(true)
  }

  return (
    <>
      {!loaded && (
        <Skeleton
          width="100%"
          height="100%"
          style={{ position: 'absolute' }}
          variant="rect"
        />
      )}
      <img
        {...imageProps}
        ref={inViewRef}
        alt={content.alt || content.label || 'image list item'}
        onLoad={onLoad}
      />
      {(content.label || content.sub_title) && (
        <GridListTileBar
          title={content.label}
          subtitle={content.sub_title}
          titlePosition={listProps.label_position || 'bottom'}
        />
      )}
    </>
  )
}
