import React, { useState } from 'react'
import clsx from 'clsx'
import { useInView } from 'react-intersection-observer'
import Skeleton from '@material-ui/lab/Skeleton'
import { useWindowWidth } from '@react-hook/window-size'
import AspectRatio from 'react-aspect-ratio'
import {
  getImageAttrs,
  getOriginalImageDimensions
} from '../../utils/ImageService'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { LmImageProps } from './imageTypes'
import 'react-aspect-ratio/aspect-ratio.css'

export default function LmImage({
  content,
  onClick
}: LmImageProps): JSX.Element {
  console.log('Aspect')
  const width = useWindowWidth()
  const isMobile = width < 600
  const [loaded, setLoaded] = useState<boolean>(false)
  const imageCrop = content.image_crop || []
  const property = content.property || []
  const fitInColor = content.color?.rgba || content.fit_in_color
  const altText = content.alt || 'website image'

  const [refIntersectionObserver, inView, intersectionElement] = useInView(
    intersectionDefaultOptions
  )

  const imgProperties = {
    src: '',
    srcSet: ''
  }

  let definedHeight = content.height
  if (isMobile && content.height_xs) {
    definedHeight = content.height_xs
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
    const square =
      property.includes('rounded-circle') || property.includes('square')
    let definedWidth = content.width
    const w = Math.ceil(parentDim.width || width)
    if ((!definedWidth && !definedHeight) || imageCrop.length || fitInColor) {
      // default: set available width to the current width either in crop mode
      definedWidth =
        definedWidth || (parentDim.height / parentDim.width) * 100 > 300
          ? grandParentDim.width
          : w
      if (definedWidth > parentDim.width) {
        definedWidth = parentDim.width
      }
    }

    if (square) {
      // overwrite if square
      const iconSize = definedHeight || definedWidth || 64
      definedWidth = iconSize
      definedHeight = iconSize
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

  let originalDimensions
  let ratio
  let maxWidth
  if (inView && content.source) {
    originalDimensions = getOriginalImageDimensions(content.source || '')
    ratio = originalDimensions.width / originalDimensions.height
    maxWidth = Math.min(
      originalDimensions.width,
      width,
      content.width || Infinity
    )
  }
  const onImageLoaded = () => {
    setLoaded(true)
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <>
      <span ref={refIntersectionObserver} />
      <AspectRatio ratio={ratio} style={{ maxWidth }}>
        {!loaded && (
          <Skeleton
            style={{ position: 'absolute' }}
            width="100%"
            height="100%"
            variant={property.includes('rounded-circle') ? 'circle' : 'rect'}
          />
        )}
        {ratio && (
          <img
            {...imgProperties}
            alt={altText}
            style={{
              cursor: onClick ? 'pointer' : undefined,
              maxHeight: 'inherit'
            }}
            className={clsx(content.property, content.class_names?.values)}
            onLoad={onImageLoaded}
            onClick={() => {
              onClick && onClick()
            }}
          />
        )}
      </AspectRatio>
    </>
  )
}
