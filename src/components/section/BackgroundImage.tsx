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
    objectFitContain: {
      objectFit: 'contain'
    },
    objectFitCover: {
      objectFit: 'cover'
    },
    objectFitNone: {
      objectFit: 'none'
    },
    root: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
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
  console.log(backgroundStyle)
  const {
    image,
    alternative_image,
    // ,
    // disable_smart_crop,
    // image_focal_point,
    hide_image_on_breakpoint,
    priority,
    disable_lazy_loading
  } = content
  const dontRender = hide_image_on_breakpoint && matches
  const loading = priority || disable_lazy_loading ? 'eager' : 'lazy'
  const imageSource = (
    (alternative_image && height > width ? alternative_image : image) || ''
  ).replace('//a', 'https://img2')
  if (dontRender) {
    return null
  }

  // @TODO
  // - backgroundStyle options
  // - SB options for loading and priority
  return (
    <div className={clsx(classes.root)}>
      {imageSource && (
        <Image
          src={imageSource}
          sizes="100vw"
          priority={!!priority}
          loading={loading}
          layout="fill"
          className={classes.objectFitCover}
        />
      )}
    </div>
  )
}

export default BackgroundImage
