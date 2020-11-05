import React, { useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import clsx from 'clsx'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useWindowSize } from '@react-hook/window-size'
import {
  BackgroundStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { getImageAttrs } from '../../utils/ImageService'
import ImageShadow from './ImageShadow'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      // zIndex: 0
      '&.lm-fixed-bg': {
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        // backgroundSize: 'initial', // not sure why this was set before
        '&.lm-fixed-bg__top': {
          backgroundPosition: 'top'
        },
        [`${theme.breakpoints.down('sm')}and (orientation: portrait)`]: {
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll'
        },
        [`${theme.breakpoints.down('sm')}and (orientation: landscape)`]: {
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll'
        }
      }
    }
  })
)

type BackgroundImageProps = {
  content: BackgroundStoryblok
  backgroundStyle?: SectionStoryblok['background_style']
}

function BackgroundImage({
  content,
  backgroundStyle
}: BackgroundImageProps): JSX.Element | null {
  const classes = useStyles()
  const [width, height] = useWindowSize()
  const [imgSrc, setImgSrc] = useState<string | undefined>()
  const [viewRef, inView, anchorRef] = useInView(intersectionDefaultOptions)
  const theme = useTheme()
  const matches = useMediaQuery(
    theme.breakpoints.down(content.hide_image_on_breakpoint || 'xs')
  )
  const isDesktop = width >= 1280
  const {
    image,
    alternative_image,
    disable_smart_crop,
    image_focal_point,
    hide_image_on_breakpoint
  } = content
  const current = anchorRef && (anchorRef.target as HTMLDivElement)
  const dontRender = hide_image_on_breakpoint && matches

  const imgAttrs = useMemo(() => {
    if (!current || !inView || !image || dontRender) {
      return {
        src: '',
        srcSet: ''
      }
    }
    let currentWidth = current.clientWidth
    let currentHeight = current.clientHeight
    if (isDesktop) {
      if (backgroundStyle === 'fixed_cover') {
        currentWidth = width
        currentHeight = height
      } else if (backgroundStyle === 'fixed_image') {
        currentHeight += 200
        currentWidth += 200
      }
    }

    const isAlternativeSource = alternative_image && height > width
    return getImageAttrs({
      originalSource: isAlternativeSource
        ? (alternative_image as string)
        : image,
      width: currentWidth,
      height: currentHeight,
      smart: !disable_smart_crop,
      focalPoint: !isAlternativeSource ? image_focal_point : undefined
    })
  }, [
    current,
    inView,
    image,
    alternative_image,
    dontRender,
    disable_smart_crop,
    image_focal_point,
    height,
    width,
    backgroundStyle,
    isDesktop
  ])

  // const imgSrc = useGetSrcHook(imageAttrs)
  return (
    <>
      {!imgSrc && image && (
        <Skeleton
          width="100%"
          height="100%"
          style={{ position: 'absolute' }}
          variant="rect"
        />
      )}
      <ImageShadow
        src={imgAttrs.src}
        srcSet={imgAttrs.srcSet}
        afterLoad={setImgSrc}
      />

      <div
        className={clsx(classes.root, {
          'lm-fixed-bg':
            backgroundStyle === 'fixed_image' ||
            backgroundStyle === 'fixed_cover',
          'lm-fixed-bg__top': backgroundStyle === 'fixed_image',
          'lm-fixed-bg__center': backgroundStyle === 'fixed_cover'
        })}
        style={{
          backgroundImage: imgSrc && `url('${imgSrc}')`,
          backgroundSize: content.background_size
            ? content.background_size
            : undefined,
          backgroundPosition: content.background_position
            ? content.background_position
            : undefined
        }}
        ref={viewRef}
      />
    </>
  )
}

export default BackgroundImage
