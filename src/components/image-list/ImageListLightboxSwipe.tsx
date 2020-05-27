import React from 'react'
import { getImageAttrs, getOriginalImageDimensions } from '../../utils/ImageService'
import SwipeableViews from 'react-swipeable-views'
import { ImageListItemStoryblok } from '../../typings/generated/components-schema'
import { WithWindowDimensionsProps } from '../provider/WindowDimensionsProvider'
import InvertedIndicator from '../slider/InvertedIndicator'
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ChevronRight from 'mdi-material-ui/ChevronRight'

export type ImageListLightboxProps = {
  elements: ImageListItemStoryblok[]
  lightbox: string
  setLightbox: Function
  onImageClick: Function
  dimensions: WithWindowDimensionsProps,
  className: string
}

function Swipe(props: ImageListLightboxProps): JSX.Element {
  let currentIndex = props.elements.findIndex(i => i._uid === props.lightbox)

  function getImageSource(source: string) {
    let dimensionHeight = props.dimensions.height - 68 - 16
    let dimensionWidth = props.dimensions.width - 48
    const originalDimension = getOriginalImageDimensions(source)
    const imgWidth = originalDimension.width
    const imgHeight = originalDimension.height
    dimensionWidth = imgWidth <= dimensionWidth ? imgWidth : dimensionWidth
    dimensionHeight = imgHeight <= dimensionHeight ? imgHeight : dimensionHeight
    const landscape = dimensionWidth > dimensionHeight
    return getImageAttrs({
      originalSource: source,
      width: landscape ? 0 : dimensionWidth,
      height: landscape ? dimensionHeight : 0
    })
  }

  function handleChangeIndex(index: number) {
    props.onImageClick(props.elements[index])
  }

  return (
    <div className="carousel slide">
      <SwipeableViews index={currentIndex}
                      className="carousel-inner"
                      onChangeIndex={handleChangeIndex}>
        {props.elements.map(item => (
          <div key={item._uid} className="carousel-item">
            <figure className="d-block">
              <img {...getImageSource(item.source as string)}
                   className='img-fluid' />
            </figure>
          </div>
        ))}
      </SwipeableViews>
      <a className="carousel-control-prev"
         role="button"
         onClick={() => props.onImageClick(currentIndex === 0 ? props.elements[props.elements.length - 1] : props.elements[currentIndex - 1])}>
        <ChevronLeft />
      </a>
      <a className="carousel-control-next"
         role="button"
         onClick={() => props.onImageClick(currentIndex === props.elements.length - 1 ? props.elements[0] : props.elements[currentIndex + 1])}>
        <ChevronRight />
      </a>
      <ol className="carousel-indicators">
        {props.elements.map((item) => (
          <InvertedIndicator key={item._uid}
                             active={props.lightbox === item._uid}
                             color={'light'}
                             onClick={() => props.onImageClick(item)} />
        ))}
      </ol>
    </div>
  )
}

export default Swipe
