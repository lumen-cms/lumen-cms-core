import React from 'react'
import {
  getOriginalImageDimensions,
  imageCalculateHeight
} from '../../utils/imageServices'
import { LmImageProps } from './imageTypes'
import LmAspectRatio from './LmAspectRatio'
import LmSquareImage from '../avatar/LmSquareImage'
import { ImageStoryblok } from '../../typings/generated/components-schema'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles<ImageStoryblok>({ name: 'Image' })(
  (theme, props) => ({
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
        borderRadius: '50%',
        overflow: 'hidden'
      }
    },
    customImage: {
      borderRadius: props.border_radius ? props.border_radius : undefined
    }
  })
)

export default function LmImage({
  content,
  onClick
}: LmImageProps): JSX.Element | null {
  const { classes, cx: clsx } = useStyles(content)
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
  const originalDimensions =
    content.image_data || getOriginalImageDimensions(imageSource || '')

  const manualSquare =
    definedWidth && definedHeight && definedWidth === definedHeight
  const squareOrRoundedIsSet =
    property.includes('rounded-circle') || property.includes('square')
  const isSquare = manualSquare || squareOrRoundedIsSet
  const squareSize = isSquare
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

  if (isSquare && squareSize) {
    return (
      <>
        <LmAspectRatio
          ratio={`1/1`}
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
            imageProps={{
              onClick: onClick ? () => onClick() : undefined,
              alt: content.alt || 'website image',
              style: {
                objectFit: 'cover',
                objectPosition: 'center'
              },
              loading,
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
          sizeIsHeight={!!content.height}
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
