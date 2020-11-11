import React from 'react'
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Image from 'next/image'
import { useWindowSize } from '@react-hook/window-size'
import {
  BackgroundStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
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
  const [width, height] = useWindowSize()
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
  const imageBase =
    (alternative_image && height > width ? alternative_image : image) || ''
  const imageSource = imageBase.replace('//a', 'https://img2')
  if (dontRender) {
    return null
  }

  const BgImage = () =>
    imageSource ? (
      <Image
        src={imageSource}
        sizes="100vw"
        priority={!!priority}
        loading={loading}
        objectFit={
          background_size !== 'auto' && background_size
            ? background_size
            : 'cover'
        }
        objectPosition={background_position}
        layout="fill"
      />
    ) : null

  if (backgroundStyle === 'fixed_cover') {
    return (
      <div className={clsx(classes.root, classes.rootFixedImage)}>
        <div className={classes.fixedCoverImageWrap}>
          <BgImage />
        </div>
      </div>
    )
  }
  return (
    <div className={clsx(classes.root)}>
      <BgImage />
    </div>
  )
}

export default BackgroundImage
