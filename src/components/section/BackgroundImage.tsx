import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import Image from 'next/image'
import {
  BackgroundStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'
import { getRootImageUrl } from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'

const useStyles = makeStyles((theme: Theme) =>
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
        '&.landscape div, &.landscape img, &.landscape div img': {
          display: 'none !important'
        }
      },
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      '&.hide__xs': {
        [theme.breakpoints.only('xs')]: {
          display: 'none !important'
        }
      },
      '&.hide__sm': {
        [theme.breakpoints.down('sm')]: {
          display: 'none !important'
        }
      },
      '&.hide__md': {
        [theme.breakpoints.down('md')]: {
          display: 'none !important'
        }
      }
    },
    rootFixedImage: {
      // disable for mobile
      [theme.breakpoints.up('sm')]: {
        clip: 'rect(0,auto,auto,0)!important',
        clipPath: 'polygon(0px 0px,100% 0px,100% 100%,0px 100%)!important'
      }
    },
    fixedCoverImageWrap: {
      // disable for mobile
      [theme.breakpoints.up('sm')]: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -1
      }
    }
  })
)

type BackgroundImageProps = {
  content: BackgroundStoryblok
  backgroundStyle?: SectionStoryblok['background_style']
  sectionPosition?: number
}

const BackgroundImage = ({
  content,
  backgroundStyle,
  sectionPosition
}: BackgroundImageProps): JSX.Element | null => {
  const classes = useStyles()

  const {
    image,
    alternative_image,
    background_position,
    background_size,
    hide_image_on_breakpoint,
    priority,
    disable_lazy_loading
  } = content

  const priorityLoading = priority || sectionPosition === 0
  const loading = priorityLoading
    ? undefined
    : disable_lazy_loading
    ? 'eager'
    : undefined
  const imageSource = image
  const imageSourcePortrait = alternative_image || undefined

  const BgImage = (props: { src?: string }) => {
    if (!props.src) {
      return null
    }
    return (
      <Image
        src={getRootImageUrl(props.src)}
        {...storyblokImageLoader(props.src)}
        priority={priorityLoading}
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

  if (['fixed_cover', 'fixed_image'].includes(backgroundStyle || '')) {
    return (
      <>
        <div
          className={clsx(
            classes.root,
            classes.rootFixedImage,
            imageSourcePortrait ? 'landscape' : undefined,
            hide_image_on_breakpoint
              ? `hide__${hide_image_on_breakpoint}`
              : undefined
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
          imageSourcePortrait ? 'landscape' : undefined,
          hide_image_on_breakpoint
            ? `hide__${hide_image_on_breakpoint}`
            : undefined
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
