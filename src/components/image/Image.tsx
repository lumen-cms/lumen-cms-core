import React from 'react'
import clsx from 'clsx'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  getOriginalImageDimensions,
  imageCalculateHeight
} from '../../utils/imageServices'
import { LmImageProps } from './imageTypes'
import LmAspectRatio from './LmAspectRatio'
import LmSquareImage from '../avatar/LmSquareImage'
import { ImageStoryblok } from '../../typings/generated/components-schema'

const useStyles = makeStyles((theme: Theme) => ({
  image: {
    margin: 'auto'
    // width: '100%',
    // height: 'auto'
  },
  imgAddons: {
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
    }
  },
  customImage: (props: ImageStoryblok) => ({
    borderRadius: props.border_radius ? props.border_radius : undefined
  })
}))

export default function LmImage({
  content,
  onClick
}: LmImageProps): JSX.Element | null {
  const classes = useStyles(content)
  const definedWidth = content.width
  const definedHeight = content.height
  const property = content.property || []
  const imageSource = content.source

  const { priority, disable_lazy_loading } = content
  if (!imageSource) {
    return <div /> // don't need to render anything
  }
  const loading = priority
    ? undefined
    : disable_lazy_loading
    ? 'eager'
    : undefined
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

  if (square && squareSize) {
    return (
      <>
        <LmAspectRatio
          width={squareSize}
          height={squareSize}
          style={{
            height: squareSize <= 360 ? `${squareSize}px` : undefined,
            width: squareSize <= 360 ? `${squareSize}px` : undefined,
            margin: 'auto'
          }}
          className={clsx(
            content.class_names?.values,
            classes.imgAddons,
            content.property
          )}
        >
          <LmSquareImage
            image={imageSource}
            size={squareSize}
            layout="intrinsic"
            base64={content.image_data}
            imageProps={{
              onClick: onClick ? () => onClick() : undefined,
              alt: content.alt || 'website image',
              objectFit: 'cover',
              objectPosition: 'center',
              className: classes.customImage
            }}
          />
        </LmAspectRatio>
      </>
    )
  }
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions
    <div
      className={clsx(
        content.class_names?.values,
        classes.image,
        classes.imgAddons,
        content.property
      )}
      style={{
        maxWidth:
          isProportional && proportionalWidth
            ? `${proportionalWidth}px`
            : undefined,
        maxHeight:
          (isProportional &&
            (proportionalHeight ||
              imageCalculateHeight(proportionalWidth, originalDimensions))) ||
          undefined
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <LmSquareImage
          image={imageSource}
          size={
            isProportional
              ? Math.max(proportionalWidth, proportionalHeight)
              : Math.min(originalDimensions.width, originalDimensions.height)
          }
          layout="intrinsic"
          sizeIsHeight={!!content.height}
          base64={content.image_data}
          imageProps={{
            loading,
            priority,
            onClick: onClick ? () => onClick() : undefined,
            alt: content.alt || 'website image',
            className: classes.customImage
          }}
        />
      </div>
    </div>
  )
}
