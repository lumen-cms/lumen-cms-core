import React, { CSSProperties } from 'react'
import { useInView } from 'react-intersection-observer'
import {
  BackgroundElementColorStoryblok,
  BackgroundElementGradientStoryblok,
  BackgroundElementItemStoryblok
} from '../../typings/generated/components-schema'
import { getRootImageUrl } from '../../utils/ImageService'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'

type BackgroundElementsProps = {
  elements: (
    | BackgroundElementColorStoryblok
    | BackgroundElementItemStoryblok
    | BackgroundElementGradientStoryblok
  )[]
}

function BackgroundElements({
  elements = []
}: BackgroundElementsProps): JSX.Element {
  const [viewRef, inView] = useInView(intersectionDefaultOptions)

  const styleElement: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }

  if (inView) {
    styleElement.background = elements
      .map((item) => {
        const elementType = item.component
        switch (elementType) {
          case 'background_element_item': {
            const url = getRootImageUrl(item.url)
            return `url('${url}') ${item.horizontal || 'left'} ${
              item.vertical || 'top'
            }/${item.size || 'auto'} ${item.repeat || 'no-repeat'}`
          }
          case 'background_element_color': {
            return item.color && item.color.rgba
          }
          case 'background_element_gradient': {
            return item.value
          }
          default:
            return ''
        }
      })
      .filter((i) => i)
      .join(',')
  }
  return <div ref={viewRef} style={styleElement} />
}

export default BackgroundElements
