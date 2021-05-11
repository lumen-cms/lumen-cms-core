import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ChevronRight from 'mdi-material-ui/ChevronRight'
import Image from 'next/image'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import InvertedIndicator from '../slider/InvertedIndicator'
import { ImageListLightboxProps } from './imageListTypes'
import { ImageListItemStoryblok } from '../../typings/generated/components-schema'
import { getRootImageUrl } from '../../utils/imageServices'

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  text: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    color: 'white',
    flexDirection: 'column',
    background: 'rgba(0,0,0,0.45)',
    padding: '1rem 3rem 1rem 1rem'
  }
}))

function CarouselImageItem({ content }: { content: ImageListItemStoryblok }) {
  const classes = useStyles()
  const imageSource = content.source || ''

  return (
    <div className="carousel-item">
      <div className={classes.root}>
        <Image
          alt={content.alt || content.label || 'image list item'}
          src={getRootImageUrl(imageSource)}
          layout="fill"
          objectFit="contain"
        />
        {(content.label || content.sub_title) && (
          <div className={classes.text}>
            <Typography>{content.label}</Typography>
            <Typography variant="subtitle1">{content.sub_title}</Typography>
          </div>
        )}
      </div>
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
