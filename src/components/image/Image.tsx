import React, { useState } from 'react'
import clsx from 'clsx'
import { useInView } from 'react-intersection-observer'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import { useWindowWidth } from '@react-hook/window-size'
import AspectRatio from 'react-aspect-ratio'
import {
  getImageAttrs,
  getOriginalImageDimensions
} from '../../utils/ImageService'
import { intersectionImageOptions } from '../../utils/intersectionObserverConfig'
import { LmImageProps } from './imageTypes'
import 'react-aspect-ratio/aspect-ratio.css'

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

export default function LmImage({
  content,
  onClick
}: LmImageProps): JSX.Element {
  const classes = useStyles()
  const width = useWindowWidth()
  const isMobile = width < 600
  const [loaded, setLoaded] = useState<boolean>(false)
  const imageCrop = content.image_crop || []
  const property = content.property || []
  const fitInColor = content.color?.rgba || content.fit_in_color
  const altText = content.alt || 'website image'
  const originalDimensions = getOriginalImageDimensions(content.source || '')
  const [refIntersectionObserver, inView, intersectionElement] = useInView(
    intersectionImageOptions
  )

  const imgProperties: { src?: string; srcSet?: string } = {}
  const square =
    property.includes('rounded-circle') || property.includes('square')

  let definedHeight =
    isMobile && content.height_xs ? content.height_xs : content.height
  let definedWidth = content.width
  if (square) {
    // overwrite if square
    const iconSize = Math.min(
      definedHeight || Infinity,
      definedWidth || Infinity
    )
    definedWidth = iconSize
    definedHeight = iconSize
  }
  if (inView && content.source && intersectionElement) {
    const { parentElement } = intersectionElement.target
    const grandparentElement =
      intersectionElement.target.parentElement?.parentElement
    // console.log('parent element', hasDefinedSize, isInGrid, parentElement?.clientWidth, parentElement?.clientHeight, grandparentElement?.clientWidth, grandparentElement?.clientHeight)
    const parentDim = {
      width: parentElement?.clientWidth || 0,
      height: parentElement?.clientHeight || 0
    }
    const grandParentDim = {
      width: grandparentElement?.clientWidth || 0,
      height: grandparentElement?.clientHeight || 0
    }

    if (content.height_fill && grandParentDim.height === parentDim.height) {
      // with a tolerance of 200 height should fit grandparents height
      definedHeight = Math.ceil(grandParentDim.height)
    }
    if (content.focal_point && parentElement && !definedHeight && parentDim) {
      definedHeight = Math.ceil(parentDim.height)
    }

    const imgRatio = {
      width: Number(definedWidth || 0),
      height: definedHeight
    }

    const attrs = getImageAttrs({
      originalSource: content.source,
      ...imgRatio,
      fitInColor,
      focalPoint: content.focal_point,
      smart: imageCrop.includes('smart_crop')
    })
    imgProperties.src = attrs.src
    imgProperties.srcSet = attrs.srcSet
  }

  const onImageLoaded = () => {
    setLoaded(true)
  }

  const ratio =
    definedWidth && definedHeight
      ? definedWidth / definedHeight
      : originalDimensions.width / originalDimensions.height
  if (!definedWidth && definedHeight) {
    definedWidth =
      (definedHeight * originalDimensions.height) / originalDimensions.width
  }
  if (!definedHeight && definedWidth) {
    definedHeight =
      (definedWidth * originalDimensions.width) / originalDimensions.height
  }
  console.log(
    ratio,
    originalDimensions.width,
    definedWidth,
    originalDimensions.height,
    definedHeight
  )
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <AspectRatio
      ratio={ratio}
      onClick={() => {
        onClick && onClick()
      }}
      // className={clsx(classes.root, {
      //   // [classes.rootNoMargin]: content.disable_ratio_correction
      // })}
      style={{
        maxHeight: `${definedHeight}px`,
        maxWidth: `${definedWidth}px`
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
      <img
        {...imgProperties}
        alt={altText}
        width={content.width ? content.width : undefined}
        height={definedHeight || undefined}
        style={{
          cursor: onClick ? 'pointer' : undefined,
          // width: content.width ? `${content.width}px` : 'auto',
          maxHeight: 'inherit',
          // height: definedHeight ? `${definedHeight}px` : 'auto',
          display: !imgProperties.src ? 'none' : undefined
        }}
        className={clsx(
          classes.image,
          content.property,
          content.class_names?.values
        )}
        onLoad={onImageLoaded}
      />
      <span ref={refIntersectionObserver} />
    </AspectRatio>
  )
}
