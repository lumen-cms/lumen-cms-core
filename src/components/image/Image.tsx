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
    margin: 'auto',
    width: '100%',
    height: '100%',
    '&.img-thumbnail': {
      padding: '.25rem',
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.divider}!important`,
      borderRadius: theme.shape.borderRadius
    },
    '&.square, &.rounded-0 img': {
      borderRadius: 0
    },
    '&.rounded img': {
      borderRadius: theme.shape.borderRadius
    },
    '&.rounded-circle img': {
      borderRadius: '50%'
    },
    '&.rounded-circle': {
      borderRadius: '50%'
    },
    '&.loading': {
      backgroundColor: 'rgb(74,74,74, 0.3)'
    }
  }
}))

export default function LmImage({
  content,
  onClick
}: LmImageProps): JSX.Element | null {
  const classes = useStyles()
  const definedWidth = content.width
  const definedHeight = content.height
  const property = content.property || []
  const imageSource = content.source
  const { priority, disable_lazy_loading } = content
  const [loaded, setLoaded] = useState<boolean>(
    !!(priority || disable_lazy_loading)
  )

  const loading = priority
    ? undefined
    : disable_lazy_loading
    ? 'eager'
    : undefined
  const storyblokImage = imageSource?.replace('//a', 'https://img2')
  const originalDimensions = getOriginalImageDimensions(imageSource || '')

  const manualSquare =
    definedWidth && definedHeight && definedWidth === definedHeight
  const squareOrRoundedIsSet =
    property.includes('rounded-circle') || property.includes('square')
  const square = manualSquare || squareOrRoundedIsSet
  const squareSize = square ? definedHeight || definedWidth || 120 : undefined

  let proportionalWidth = 0
  let proportionalHeight = 0
  let isProportional = false
  if (
    !squareOrRoundedIsSet &&
    ((definedWidth && !definedHeight) || (!definedWidth && definedHeight))
  ) {
    isProportional = true
    proportionalWidth = definedWidth || 0
    proportionalHeight = definedHeight || 0
  }

  const imageAttrs = imageSource
    ? getImageAttrs({
        originalSource: imageSource,
        width: isProportional
          ? proportionalWidth
          : squareSize || definedWidth || originalDimensions.width,
        height: isProportional
          ? proportionalHeight
          : squareSize || definedHeight || originalDimensions.height,
        focalPoint: content.focal_point,
        smart: !!squareSize
      })
    : undefined

  if (!imageSource) {
    return <div /> // don't need to render anything
  }
  const containerProps: React.HTMLAttributes<HTMLDivElement> = {}
  if (onClick) {
    containerProps.onClick = () => onClick()
  }
  if (imageSource.includes('1836315_1920')) {
    console.log(
      squareSize || originalDimensions.width,
      squareSize || originalDimensions.height
    )
  }
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions
    <div
      {...containerProps}
      className={clsx(
        content.class_names?.values,
        classes.image,
        content.property,
        loaded ? 'loaded' : 'loading'
      )}
      style={{
        cursor: onClick ? 'pointer' : undefined,
        maxWidth: squareSize
          ? `${squareSize}px`
          : isProportional
          ? Math.max(proportionalWidth, proportionalHeight)
          : '100%',
        maxHeight: squareSize
          ? `${squareSize}px`
          : isProportional
          ? Math.max(proportionalHeight, proportionalWidth)
          : '100%'
      }}
    >
      {storyblokImage && (
        <Image
          src={imageAttrs?.src || storyblokImage}
          alt={content.alt || 'website image'}
          width={squareSize || originalDimensions.width / 10}
          height={squareSize || originalDimensions.height / 10}
          onLoad={() => setLoaded(true)}
          loading={loading}
          priority={priority}
          layout="responsive"
        />
      )}
    </div>
  )
}
