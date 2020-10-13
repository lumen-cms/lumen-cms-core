import React, { FunctionComponent, useRef, useState } from 'react'
import CardMedia from '@material-ui/core/CardMedia'
import Fade from '@material-ui/core/Fade'
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
  const intersecRef = useRef<HTMLDivElement>(null)
  const [imgSource, setImgSource] = useState<string>('')
  let img: { src?: string; srcSet?: string } = {}
  const contentImage = content.image
  const imageSize = options.image_size
  const mediaEl: Partial<HTMLDivElement> | null = intersecRef?.current
  // console.log(currentWidth, clientWidth)
  if (inView && contentImage && mediaEl) {
    const currentWidth = mediaEl?.clientWidth || 0
    const currentHeight = mediaEl?.clientHeight
    img = getImageAttrs({
      originalSource: contentImage,
      width: currentWidth,
      height: ['contain', 'initial', 'auto'].includes(imageSize)
        ? 0
        : currentHeight,
      smart: true
    })
  }
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
      <Fade in={!!imgSource}>
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
      </Fade>
    </>
  )
}
CardMediaElement.displayName = 'CardMediaElement'
export default CardMediaElement
