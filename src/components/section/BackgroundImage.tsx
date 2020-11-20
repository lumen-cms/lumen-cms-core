import React from 'react'
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Image from 'next/image'
import {
  BackgroundStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'
import { getRootImageUrl } from '../../utils/ImageService'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      '@media (orientation: landscape)': {
        '&.portrait': {
          display: 'none !important'
        },
        '&.portrait div, &.portrait img, &.portrait div img': {
          display: 'none !important'
        }
      },
      '@media (orientation: portrait)': {
        '&.landscape': {
          display: 'none !important'
        },
        '&.portrait div, &.portrait img, &.portrait div img': {
          display: 'none !important'
        }
      },
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    },
    rootFixedImage: {
      clip: 'rect(0,auto,auto,0)!important',
      clipPath: 'polygon(0px 0px,100% 0px,100% 100%,0px 100%)!important'
    },
    fixedCoverImageWrap: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: -1
    }
  })
)

type BackgroundImageProps = {
  content: BackgroundStoryblok
  backgroundStyle?: SectionStoryblok['background_style']
}

const BackgroundImage = ({
  content,
  backgroundStyle
}: BackgroundImageProps): JSX.Element | null => {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(
    theme.breakpoints.down(content.hide_image_on_breakpoint || 'xs')
  )
  const {
    image,
    alternative_image,
    background_position,
    background_size,
    // disable_smart_crop,
    // image_focal_point,
    hide_image_on_breakpoint,
    priority,
    disable_lazy_loading
  } = content
  const dontRender = hide_image_on_breakpoint && matches
  const loading = priority
    ? undefined
    : disable_lazy_loading
    ? 'eager'
    : undefined
  const imageSource = getRootImageUrl(image)
  const imageSourcePortrait = alternative_image
    ? getRootImageUrl(alternative_image)
    : undefined

  if (dontRender) {
    return null
  }

  const BgImage = (props: { src?: string }) => {
    if (!props.src) {
      return null
    }
    return (
      <Image
        src={props.src}
        priority={!!priority}
        loading={loading}
        objectFit={
          background_size !== 'auto' && background_size
            ? background_size
            : 'cover'
        }
        objectPosition={background_position || 'center'}
        layout="fill"
      />
    )
  }

  if (backgroundStyle === 'fixed_cover') {
    return (
      <>
        <div
          className={clsx(
            classes.root,
            classes.rootFixedImage,
            imageSourcePortrait ? 'landscape' : undefined
          )}
        >
          <div className={classes.fixedCoverImageWrap}>
            <BgImage src={imageSource} />
          </div>
        </div>
        {imageSourcePortrait && (
          <div
            className={clsx(classes.root, classes.rootFixedImage, 'portrait')}
          >
            <div className={classes.fixedCoverImageWrap}>
              <BgImage src={imageSourcePortrait} />
            </div>
          </div>
        )}
      </>
    )
  }
  return (
    <>
      <div
        className={clsx(
          classes.root,
          imageSourcePortrait ? 'landscape' : undefined
        )}
      >
        <BgImage src={imageSource} />
      </div>
      {imageSourcePortrait && (
        <div className={clsx(classes.root, 'portrait')}>
          <BgImage src={imageSourcePortrait} />
        </div>
      )}
    </>
  )
}

export default BackgroundImage
