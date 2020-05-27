import React, { CSSProperties } from 'react'
import {
  BackgroundElementColorStoryblok,
  BackgroundElementGradientStoryblok,
  BackgroundElementItemStoryblok
} from '../../typings/generated/components-schema'
import imageService from '../../utils/ImageService'
import { useInView } from 'react-intersection-observer'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'

type BackgroundElementsProps = {
  elements: (BackgroundElementColorStoryblok | BackgroundElementItemStoryblok | BackgroundElementGradientStoryblok)[]
}

function BackgroundElements({ elements = [] }: BackgroundElementsProps): JSX.Element {
  const [viewRef, inView] = useInView(intersectionDefaultOptions)

  let styleElement: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }

  if (inView) {
    styleElement.background = elements.map(item => {
      const elementType = item.component
      switch (elementType) {
        case 'background_element_item': {
          const url = imageService(item.url || '', '')
          return `url('${url}') ${item.horizontal || 'left'} ${item.vertical || 'top'}/${item.size || 'auto'} ${item.repeat || 'no-repeat'}`
        }
        case 'background_element_color': {
          return item.color && item.color.rgba
        }
        case 'background_element_gradient': {
          return item.value
        }
      }
    }).filter(i => i).join(',')
  }
  return (
    <div
      ref={viewRef}
      style={styleElement} />
  )
}

export default BackgroundElements
