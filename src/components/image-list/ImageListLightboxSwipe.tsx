import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ChevronRight from 'mdi-material-ui/ChevronRight'
import Image from 'next/image'
import {
  getOriginalImageDimensions,
  getRootImageUrl
} from '../../utils/ImageService'
import InvertedIndicator from '../slider/InvertedIndicator'
import { ImageListLightboxProps } from './imageListTypes'
import { ImageListItemStoryblok } from '../../typings/generated/components-schema'

function CarouselImageItem({ content }: { content: ImageListItemStoryblok }) {
  const imageSource = getRootImageUrl(content.source)
  const originalDimensions = getOriginalImageDimensions(imageSource)
  return (
    <div className="carousel-item">
      <Image
        src={imageSource}
        width={originalDimensions.width}
        height={originalDimensions.height}
        layout="intrinsic"
      />
    </div>
  )
}

export default function Swipe(props: ImageListLightboxProps): JSX.Element {
  const currentIndex = props.elements.findIndex(
    (i) => i._uid === props.lightbox
  )

  function handleChangeIndex(index: number) {
    props.onImageClick(props.elements[index])
  }

  return (
    <div className="carousel slide">
      <SwipeableViews
        index={currentIndex}
        className="carousel-inner"
        onChangeIndex={handleChangeIndex}
      >
        {props.elements.map((item) => (
          <CarouselImageItem content={item} key={item._uid} />
        ))}
      </SwipeableViews>
      {/* eslint-disable-next-line */}
      <a
        className="carousel-control-prev"
        role="button"
        tabIndex={currentIndex}
        onClick={() =>
          props.onImageClick(
            currentIndex === 0
              ? props.elements[props.elements.length - 1]
              : props.elements[currentIndex - 1]
          )
        }
      >
        <ChevronLeft />
      </a>
      {/* eslint-disable-next-line */}
      <a
        className="carousel-control-next"
        tabIndex={currentIndex}
        role="button"
        onClick={() =>
          props.onImageClick(
            currentIndex === props.elements.length - 1
              ? props.elements[0]
              : props.elements[currentIndex + 1]
          )
        }
      >
        <ChevronRight />
      </a>
      <ol className="carousel-indicators">
        {props.elements.map((item) => (
          <InvertedIndicator
            key={item._uid}
            active={props.lightbox === item._uid}
            color="light"
            onClick={() => props.onImageClick(item)}
          />
        ))}
      </ol>
    </div>
  )
}
