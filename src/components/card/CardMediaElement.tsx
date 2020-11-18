import React, { createRef, FunctionComponent, useEffect, useState } from 'react'
import CardMedia from '@material-ui/core/CardMedia'
import Skeleton from '@material-ui/lab/Skeleton'
import { getImageAttrs } from '../../utils/ImageService'
import ImageShadow from '../section/ImageShadow'
import { CardListItemProps } from './cardTypes'

const CardMediaElement: FunctionComponent<CardListItemProps> = ({
  children,
  content,
  options,
  inView
}) => {
  const intersecRef = createRef<HTMLDivElement>() // don't use useRef here!! it randomly returns null
  const [imgSource, setImgSource] = useState<string>('')
  const [img, setImg] = useState<{ src?: string; srcSet?: string }>({})
  const contentImage = content.image
  const imageSize = options.image_size
  useEffect(() => {
    const { current } = intersecRef
    if (inView && contentImage && current && !img.src) {
      setImg(
        getImageAttrs({
          originalSource: contentImage,
          width: current.clientWidth || 0,
          height: ['contain', 'initial', 'auto'].includes(imageSize)
            ? 0
            : current.clientHeight,
          smart: true
        })
      )
    }
  }, [inView, contentImage, imageSize, img.src, intersecRef])

  return (
    <>
      {!imgSource && (
        <Skeleton
          style={{ position: 'absolute' }}
          width="100%"
          height="100%"
          variant="rect"
        />
      )}
      <ImageShadow src={img.src} srcSet={img.srcSet} afterLoad={setImgSource} />
      <CardMedia
        style={{
          color:
            options.variant && options.variant.includes('font_white')
              ? 'white'
              : 'inherit',
          backgroundSize: imageSize || 'cover'
        }}
        image={imgSource}
        ref={intersecRef}
      >
        {!imgSource && <div />}
        {children}
      </CardMedia>
    </>
  )
}
CardMediaElement.displayName = 'CardMediaElement'
export default CardMediaElement
