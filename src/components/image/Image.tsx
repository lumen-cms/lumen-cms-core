import {
  getOriginalImageDimensions,
  imageCalculateHeight
} from '../../utils/imageServices'
import { LmImageProps } from './imageTypes'
import LmAspectRatio from './LmAspectRatio'
import LmSquareImage from '../avatar/LmSquareImage'
import Box from '@mui/material/Box'
import { SystemStyleObject } from '@mui/system'
import { Theme } from '@mui/material/styles'
import clsx from 'clsx'

const imgAddonsSx: SystemStyleObject<Theme> = {
  '&.square, &.rounded-0 img': {
    borderRadius: 0
  },
  '&.rounded img': {
    borderRadius: 1
  },
  '&.rounded-circle img': {
    borderRadius: '50%'
  },
  '&.rounded-circle': {
    borderRadius: '50%',
    overflow: 'hidden'
  }
}

function getImageLayout(content: LmImageProps['content']) {
  const definedWidth = content.width
  const definedHeight = content.height
  const property = content.property || []
  const imageSource = content.source

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
    proportionalWidth = Number(definedWidth || 0)
    proportionalHeight = Number(definedHeight || 0)
  }

  return {
    originalDimensions,
    isSquare,
    squareSize,
    isProportional,
    proportionalWidth,
    proportionalHeight
  }
}

export default function LmImage({
  content,
  onClick
}: LmImageProps): React.JSX.Element | null {
  const imageSx: SystemStyleObject<Theme> = {
    ...imgAddonsSx,
    ...(content.border_radius && {
      '& img': { borderRadius: content.border_radius }
    })
  }
  if (!content.source) return <div />
  const loading =
    !content.priority && content.disable_lazy_loading ? 'eager' : undefined
  const layout = getImageLayout(content)
  const presentation: ImagePresentationProps = {
    content,
    onClick,
    imageSx,
    loading,
    layout
  }
  if (layout.isSquare && layout.squareSize)
    return <SquareImage {...presentation} />
  return <ProportionalImage {...presentation} />
}

type ImagePresentationProps = LmImageProps & {
  imageSx: SystemStyleObject<Theme>
  loading: 'eager' | undefined
  layout: ReturnType<typeof getImageLayout>
}

function SquareImage({
  content,
  onClick,
  imageSx,
  loading,
  layout
}: ImagePresentationProps) {
  const imageSource = content.source!
  const { squareSize } = layout
  return (
    <>
      <LmAspectRatio
        ratio={`1/1`}
        style={{
          height: Number(squareSize) <= 360 ? `${squareSize}px` : undefined,
          width: Number(squareSize) <= 360 ? `${squareSize}px` : undefined,
          margin: 'auto'
        }}
        className={clsx(
          'lm-image',
          content.class_names?.values,
          content.property
        )}
        sx={imageSx}
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
            fill: true
          }}
        />
      </LmAspectRatio>
    </>
  )
}

function ProportionalImage({
  content,
  onClick,
  imageSx,
  loading,
  layout
}: ImagePresentationProps) {
  const imageSource = content.source!
  const { priority } = content
  const {
    isProportional,
    proportionalHeight,
    proportionalWidth,
    originalDimensions
  } = layout
  const proportionalHeightCalc =
    isProportional &&
    (proportionalHeight ||
      imageCalculateHeight(proportionalWidth, originalDimensions))
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/no-static-element-interactions
    <Box
      className={clsx(
        'lm-image',
        content.class_names?.values,
        content.property
      )}
      sx={{ margin: 'auto', ...imageSx }}
      style={{
        maxWidth:
          isProportional && proportionalWidth
            ? `${proportionalWidth}px`
            : undefined,
        maxHeight: proportionalHeightCalc
          ? `${proportionalHeightCalc}px`
          : undefined
      }}
    >
      <div
        style={{
          textAlign: 'center'
        }}
      >
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
            ...(isProportional
              ? proportionalHeightCalc
                ? {
                    style: {
                      height: `auto`,
                      // width: 'auto',
                      maxHeight: `${proportionalHeightCalc}px`,
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }
                  }
                : {
                    style: {
                      width: `${proportionalWidth}px`,
                      height: 'auto',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }
                  }
              : {
                  style: {
                    width: '100%',
                    height: 'auto'
                  }
                })
          }}
        />
      </div>
    </Box>
  )
}
