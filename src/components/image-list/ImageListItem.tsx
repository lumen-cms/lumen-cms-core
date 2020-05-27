import * as React from 'react'
import { FunctionComponent, useState } from 'react'
import { ImageListItemStoryblok, ImageListStoryblok } from '../../typings/generated/components-schema'
import Fade from '@material-ui/core/Fade'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import { useInView } from 'react-intersection-observer'
import { getImageAttrs } from '../../utils/ImageService'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import Skeleton from '@material-ui/lab/Skeleton'
import ContentLink from '../link/ContentLink'

const ImageListItemContainer: FunctionComponent<{ content: ImageListItemStoryblok }> = ({ content, children }) => {
  return content.link?.cached_url
    ? <ContentLink className={'img-list-item'} content={content}>{children}</ContentLink>
    : <>{children}</>
}
ImageListItemContainer.displayName = 'ImageListItemContainer'

export type LmImageListItemProps = {
  content: ImageListItemStoryblok,
  listProps: ImageListStoryblok
}

export function LmImageListItem(props: LmImageListItemProps): JSX.Element {
  const { content, listProps } = props
  const [inViewRef, inView, currentRef] = useInView(intersectionDefaultOptions)
  const [loaded, setLoaded] = useState<boolean>(false)
  // const width = listProps.width
  const styles = {}
  let imageProps: { src?: string, srcSet?: string, width?: number | string, height?: number | string } = {}

  if (inView && content.source && currentRef?.target) {
    // if (listProps.image_crop && !listProps.masonry /*|| (!listProps.masonry && !listProps.fit_in_color)*/) {
    //   height = listProps.height
    // }
    const tile = currentRef.target.closest('.MuiGridListTile-root')
    let width = tile?.clientWidth
    let height = tile?.clientHeight

    if (!width) {
      return <span>some error with image list item</span>
    }
    width = Math.ceil(width)
    const respectImgRatio = listProps.masonry || !listProps.aspect_ratio || !listProps.image_crop
    height = respectImgRatio ? 0 : height && Math.ceil(height)
    const imgSrc = getImageAttrs({
      originalSource: content.source,
      width,
      height: height,
      smart: listProps.image_crop === 'smart',
      fitInColor: listProps.fit_in_color
    })
    imageProps = {
      ...imgSrc,
      width: width ? width : undefined,
      height: height ? height : undefined
    }
  }

  function onLoad() {
    setLoaded(true)
  }

  return (
    <ImageListItemContainer content={content}>
      {!loaded && <Skeleton width={'100%'} height={'100%'} style={{ position: 'absolute' }} variant="rect" />}
      <Fade in={loaded}>
        <img {...imageProps}
             ref={inViewRef}
             style={styles}
             alt={'image list item'}
             onLoad={onLoad} />
      </Fade>
      {(content.label || content.sub_title) &&
      <GridListTileBar title={content.label} subtitle={content.sub_title}
                       titlePosition={listProps.label_position || 'bottom'} />}
    </ImageListItemContainer>
  )
}
