import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Image from 'next/image'
import {
  getImageAttrs,
  getOriginalImageDimensions
} from '../../utils/ImageService'
import { LmImageProps } from './imageTypes'

const useStyles = makeStyles((theme: Theme) => ({
  image: {
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
}: LmImageProps): JSX.Element | null {
  const definedWidth = content.width
  const definedHeight = content.height
  const classes = useStyles()
  const [loaded, setLoaded] = useState<boolean>(false)
  const property = content.property || []
  const imageSource = content.source
  const storyblokImage = imageSource?.replace('//a', 'https://img2')
  const originalDimensions = getOriginalImageDimensions(imageSource || '')

  const square =
    property.includes('rounded-circle') || property.includes('square')
  const squareSize = square ? definedHeight || definedWidth || 120 : undefined

  // const imageAttrs = imageSource
  //   ? getImageAttrs({
  //       originalSource: imageSource,
  //       width: squareSize || originalDimensions.width,
  //       height: squareSize || originalDimensions.height,
  //       focalPoint: content.focal_point,
  //       smart: !!squareSize
  //     })
  //   : undefined

  if (!imageSource) {
    return <div /> // don't need to render anything
  }
  // console.log(imageAttrs?.src)
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions
    <div
      onClick={() => {
        onClick && onClick()
      }}
      className={clsx(content.class_names?.values)}
      style={{
        backgroundColor: loaded ? 'transparent' : 'rgb(74,74,74, 0.1)',
        maxWidth: '100%'
      }}
    >
      {storyblokImage && (
        <Image
          src={storyblokImage}
          alt={content.alt || 'website image'}
          width={originalDimensions.width}
          height={originalDimensions.height}
          style={{
            cursor: onClick ? 'pointer' : undefined,
            maxHeight: 'inherit'
          }}
          className={clsx(classes.image, content.property)}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  )
}
