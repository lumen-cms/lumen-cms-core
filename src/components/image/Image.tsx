import React, { useState } from 'react'
import clsx from 'clsx'
import { useInView } from 'react-intersection-observer'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'
import Skeleton from '@material-ui/lab/Skeleton'
import { useWindowWidth } from '@react-hook/window-size'
import {
  getImageAttrs,
  getOriginalImageDimensions
} from '../../utils/ImageService'
import { LmImageProps } from './imageTypes'
import { AspectRatio } from './RatioContainer'
import { intersectionImageOptions } from '../../utils/intersectionObserverConfig'
import { getNumber } from '../../utils/numberParser'

const useStyles = makeStyles((theme: Theme) => ({
  // root: {
  //   display: 'inline-block'
  // margin: '0 0 -6px 0 !important',
  // overflow: 'auto',
  // padding: 0,
  // position: 'relative'
  // },
  rootNoMargin: {
    margin: '0 !important'
  },
  image: {
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

export default function LmImage({
  content,
  onClick
}: LmImageProps): JSX.Element | null {
  const classes = useStyles()
  const width = useWindowWidth()
  const isMobile = width < 600
  const [loaded, setLoaded] = useState<boolean>(false)
  const imageCrop = content.image_crop || []
  const property = content.property || []
  const fitInColor = content.color?.rgba || content.fit_in_color

  const [refIntersectionObserver, inView, intersectionElement] = useInView(
    intersectionImageOptions
  )

  const imgProperties: { src?: string; srcSet?: string } = {}
  const imageSource = content.source

  if (!imageSource) {
    return <div /> // don't need to render anything
  }

  const originalDimensions = getOriginalImageDimensions(imageSource || '')

  let definedWidth = getNumber(content.width) as number | undefined
  let definedHeight =
    content.height_xs && isMobile
      ? (getNumber(content.height) as number | undefined)
      : (getNumber(content.height) as number | undefined)
  if (inView && imageSource && intersectionElement) {
    const { parentElement } = intersectionElement.target
    const grandparentElement =
      intersectionElement.target.parentElement?.parentElement
    const parentDim = {
      width: parentElement?.clientWidth || 0,
      height: parentElement?.clientHeight || 0
    }
    const grandParentDim = {
      width: grandparentElement?.clientWidth || 0,
      height: grandparentElement?.clientHeight || 0
    }

    const square =
      property.includes('rounded-circle') || property.includes('square')

    const w = Math.ceil(parentDim.width || width)
    if ((!definedWidth && !definedHeight) || imageCrop.length || fitInColor) {
      // default: set available width to the current width either in crop mode
      definedWidth =
        definedWidth || (parentDim.height / parentDim.width) * 100 > 300
          ? grandParentDim.width
          : w
    }
    if (square) {
      // overwrite if square
      const iconSize = definedHeight || definedWidth || 120
      definedWidth = iconSize
      definedHeight = iconSize
    }
    if (content.height_fill) {
      // with a tolerance of 200 height should fit grandparents height
      if (grandParentDim.height === parentDim.height) {
        definedHeight = Math.ceil(grandParentDim.height)
      }
    }

    const imgRatio = {
      width: definedWidth || 0,
      height: definedHeight
    }

    const attrs = getImageAttrs({
      originalSource: imageSource,
      ...imgRatio,
      fitInColor,
      focalPoint: content.focal_point,
      smart: imageCrop.includes('smart_crop')
    })
    imgProperties.src = attrs.src
    imgProperties.srcSet = attrs.srcSet
  }

  function onImageLoaded() {
    setLoaded(true)
  }

  const ratio =
    definedWidth && definedHeight
      ? definedWidth / definedHeight
      : originalDimensions.width / originalDimensions.height
  if (!definedWidth && definedHeight) {
    definedWidth =
      (definedHeight * originalDimensions.width) / originalDimensions.height
  }
  if (!definedHeight && definedWidth) {
    definedHeight =
      (definedWidth * originalDimensions.height) / originalDimensions.width
  }
  definedHeight =
    originalDimensions.height < (definedHeight || 0)
      ? originalDimensions.height
      : definedHeight
  definedWidth =
    originalDimensions.width < (definedWidth || 0)
      ? originalDimensions.width
      : definedWidth
  return (
    <>
      <span ref={refIntersectionObserver} />
      <AspectRatio
        ratio={ratio}
        onClick={() => {
          onClick && onClick()
        }}
        className={clsx(content.class_names?.values)}
        // className={clsx(classes.root, {
        // [classes.rootNoMargin]: content.disable_ratio_correction
        // })}
        style={{
          maxHeight: definedHeight,
          maxWidth: definedWidth,
          height: getNumber(content.width),
          width: getNumber(content.width, 'inherit')
          // maxHeight: definedHeight
          //   ? `${definedHeight}px`
          //   : content.height_fill
          //   ? '100%'
          //   : undefined,
          // maxWidth: definedWidth
          //   ? `${definedWidth}px`
          //   : content.height_fill
          //   ? '100%'
          //   : undefined
        }}
      >
        {!loaded && (
          <Skeleton
            style={{ position: 'absolute' }}
            width="100%"
            height="100%"
            variant={property.includes('rounded-circle') ? 'circle' : 'rect'}
          />
        )}
        <Fade in={loaded}>
          <img
            {...imgProperties}
            alt={content.alt || 'website image'}
            width={definedWidth || undefined}
            height={definedHeight || undefined}
            style={{
              cursor: onClick ? 'pointer' : undefined,
              // width: content.width ? `${content.width}px` : 'auto',
              maxHeight: 'inherit'
              // height: content.height ? `${content.height}px` : 'auto'
            }}
            className={clsx(classes.image, content.property)}
            onLoad={onImageLoaded}
          />
        </Fade>
      </AspectRatio>
    </>
  )
}
