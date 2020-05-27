import { getImageAttrs } from '../../utils/ImageService'
import * as React from 'react'
import { FunctionComponent, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { CardListItemProps } from './cards'
import CardMedia from '@material-ui/core/CardMedia'
import Fade from '@material-ui/core/Fade'
import Skeleton from '@material-ui/lab/Skeleton'
import ImageShadow from '../section/ImageShadow'

const CardMediaElement: FunctionComponent<CardListItemProps> = ({ children, content, options }) => {
  const [reference, inView, intersecRef] = useInView(intersectionDefaultOptions)
  const [imgSource, setImgSource] = useState<string>('')
  const contentImage = content.image
  let img: { src: string, srcSet: string } = { src: '', srcSet: '' }
  const imageSize = options.image_size
  if (inView && contentImage && intersecRef && intersecRef.target) {
    const mediaEl: Partial<HTMLDivElement> | undefined = intersecRef?.target
    const currentWidth = mediaEl?.clientWidth || 0
    const currentHeight = mediaEl?.clientHeight
    img = getImageAttrs({
      originalSource: contentImage,
      width: currentWidth,
      height: ['contain', 'initial', 'auto'].includes(imageSize) ? 0 : currentHeight,
      smart: true
    })
  }
  return (
    <>
      {!imgSource && <Skeleton style={{ position: 'absolute' }} width={'100%'} height={'100%'} variant="rect" />}
      <ImageShadow src={img.src} srcSet={img.srcSet} afterLoad={setImgSource} />
      <Fade in={!!imgSource}>
        <CardMedia style={{
          color: options.variant && options.variant.includes('font_white') ? 'white' : 'inherit',
          backgroundSize: imageSize || 'cover'
        }}
                   image={imgSource}
                   ref={reference}
        >
          {!imgSource && <div></div>}
          {children}
        </CardMedia>
      </Fade>
    </>
  )
}
CardMediaElement.displayName = 'CardMediaElement'
export default CardMediaElement
