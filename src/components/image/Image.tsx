import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import Image from 'next/image'
import {
  getOriginalImageDimensions,
  getRootImageUrl,
  imageSizesOnWidthAndBreakpoints
} from '../../utils/ImageService'
import { LmImageProps } from './imageTypes'

const useStyles = makeStyles((theme: Theme) => ({
  image: {
    margin: 'auto',
    width: '100%',
    height: 'auto'
  },
  imgAddons: {
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
  const { breakpoints } = useTheme()

  const classes = useStyles()
  const definedWidth = content.width
  const definedHeight = content.height
  const property = content.property || []
  const imageSource = content.source

  const { priority, disable_lazy_loading } = content
  const [loaded, setLoaded] = useState<boolean>(
    !!(priority || disable_lazy_loading)
  )
  if (!imageSource) {
    return <div /> // don't need to render anything
  }
  const loading = priority
    ? undefined
    : disable_lazy_loading
    ? 'eager'
    : undefined
  const storyblokImage = getRootImageUrl(imageSource)
  const originalDimensions = getOriginalImageDimensions(imageSource || '')

  const manualSquare =
    definedWidth && definedHeight && definedWidth === definedHeight
  const squareOrRoundedIsSet =
    property.includes('rounded-circle') || property.includes('square')
  const square = manualSquare || squareOrRoundedIsSet
  const squareSize = square
    ? definedHeight || definedWidth || originalDimensions.width // todo was set to 120 before, does it break things?
    : undefined

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

  const containerProps: React.HTMLAttributes<HTMLDivElement> = {}
  if (onClick) {
    containerProps.onClick = () => onClick()
  }
  let sizes
  if (squareSize || definedWidth) {
    const currentWidth = squareSize || (definedWidth as number)
    sizes = imageSizesOnWidthAndBreakpoints(currentWidth, breakpoints)
  }
  if (square && squareSize) {
    return (
      <div
        {...containerProps}
        style={{
          margin: 'auto',
          position: 'relative',
          overflow: 'hidden',
          display: 'block',
          maxWidth: `${squareSize}px`,
          maxHeight: `${squareSize}px`,
          width: squareSize < 360 ? `${squareSize}px` : undefined,
          height: squareSize < 360 ? `${squareSize}px` : undefined
        }}
        className={clsx(
          content.class_names?.values,
          classes.imgAddons,
          content.property,
          loaded ? 'loaded' : 'loading'
        )}
      >
        <div style={{ paddingBottom: '100%' }} />
        <Image
          src={storyblokImage}
          alt={content.alt || 'website image'}
          onLoad={() => setLoaded(true)}
          loading={loading}
          priority={priority}
          sizes={sizes}
          layout="fill"
          objectFit="cover"
        />
      </div>
    )
  }
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions
    <div
      {...containerProps}
      className={clsx(
        content.class_names?.values,
        classes.image,
        classes.imgAddons,
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
      <Image
        src={storyblokImage}
        alt={content.alt || 'website image'}
        width={squareSize || originalDimensions.width}
        height={squareSize || originalDimensions.height}
        onLoad={() => setLoaded(true)}
        loading={loading}
        priority={priority}
        layout="responsive"
        sizes={sizes}
        unoptimized={imageSource.endsWith('.gif')}
      />
    </div>
  )
}
