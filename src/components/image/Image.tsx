import React, { useState } from 'react'
import clsx from 'clsx'
import { useInView } from 'react-intersection-observer'
import { getImageAttrs } from '../../utils/ImageService'
import { ImageStoryblok } from '../../typings/generated/components-schema'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'
import Skeleton from '@material-ui/lab/Skeleton'
import { useWindowDimensions } from '../provider/WindowDimensionsProvider'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'inline-block',
    margin: '0 0 -6px 0 !important',
    overflow: 'auto',
    padding: 0,
    position: 'relative'
  },
  rootNoMargin: {
    margin: '0 !important'
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    '&.img-thumbnail': {
      padding: '.25rem',
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    },
    '&.square, &.rounded-0': {
      borderRadius: 0
    },
    '&.rounded': {
      borderRadius: theme.shape.borderRadius
    },
    '&.rounded-circle': {
      borderRadius: '50%'
    }
  }
}))


type LmImageProps = {
  content: ImageStoryblok
}

export default function LmImage({ content }: LmImageProps): JSX.Element {
  const classes = useStyles()
  const winDims = useWindowDimensions()
  const { isMobile } = winDims
  const [loaded, setLoaded] = useState<boolean>(false)
  const imageCrop = content.image_crop || []
  const property = content.property || []
  const fitInColor = (content.color && content.color.rgba) || content.fit_in_color


  const [refIntersectionObserver, inView, intersectionElement] = useInView(intersectionDefaultOptions)

  let imgProperties = {
    src: '',
    srcSet: ''
  }

  let definedHeight = content.height_xs && isMobile ? content.height_xs : content.height
  if (inView && content.source && intersectionElement) {
    const parentElement = intersectionElement.target.parentElement
    const grandparentElement = intersectionElement.target.parentElement?.parentElement
    // console.log('parent element', hasDefinedSize, isInGrid, parentElement?.clientWidth, parentElement?.clientHeight, grandparentElement?.clientWidth, grandparentElement?.clientHeight)
    const parentDim = {
      width: parentElement?.clientWidth || 0,
      height: parentElement?.clientHeight || 0
    }
    const grandParentDim = {
      width: grandparentElement?.clientWidth || 0,
      height: grandparentElement?.clientHeight || 0
    }
    const square = property.includes('rounded-circle') || property.includes('square')
    let definedWidth = content.width
    const width = Math.ceil(parentDim.width || winDims.width)
    if ((!definedWidth && !definedHeight) || imageCrop.length || fitInColor) {
      // default: set available width to the current width either in crop mode
      definedWidth = definedWidth || (parentDim.height / parentDim.width) * 100 > 300 ? grandParentDim.width : width
    }
    if (square) {
      // overwrite if square
      const iconSize = definedHeight || definedWidth || 64
      definedWidth = iconSize
      definedHeight = iconSize
    }
    if (content.height_fill) {
      // with a tolerance of 200 height should fit grandparents height
      if (grandParentDim.height === parentDim.height) {
        definedHeight = Math.ceil(grandParentDim.height)
      }
    }
    if (content.focal_point && parentElement && !definedHeight) {

      if (parentDim) {
        definedHeight = Math.ceil(parentDim.height)
      }
    }

    const imgRatio = {
      width: Number(definedWidth || 0),
      height: definedHeight
    }

    imgProperties = getImageAttrs({
      originalSource: content.source,
      ...imgRatio,
      fitInColor,
      focalPoint: content.focal_point,
      smart: imageCrop.includes('smart_crop')
    })
  }

  function onImageLoaded() {
    setLoaded(true)
  }


  return (
    <figure ref={refIntersectionObserver}
            className={clsx(classes.root, {
              [classes.rootNoMargin]: content.disable_ratio_correction
            })}
            style={{
              height: content.height ? `${content.height}px` : content.height_fill ? '100%' : undefined,
              width: content.width ? `${content.width}px` : content.height_fill ? '100%' : undefined
            }}>
      {!loaded && <Skeleton style={{ position: 'absolute' }} width={'100%'} height={'100%'}
                            variant={property.includes('rounded-circle') ? 'circle' : 'rect'} />}
      <Fade in={loaded}>
        {!imgProperties.src ? <span /> : <img
          {...imgProperties}
          alt={content.alt || 'website image'}
          width={content.width ? content.width : undefined}
          height={definedHeight ? definedHeight : undefined}
          style={{
            width: content.width ? `${content.width}px` : 'auto',
            maxHeight: 'inherit',
            height: definedHeight ? `${definedHeight}px` : 'auto'
          }}
          className={clsx(classes.image, content.property, content.class_names?.values)}
          onLoad={onImageLoaded} />}
      </Fade>
    </figure>
  )
}
