import React, { FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import Image from 'next/image'
import {
  BackgroundStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'
import { getRootImageUrl } from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'
import { LmImagePlaceholder } from '../image/imageTypes'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '@media (orientation: landscape)': {
        '&.portrait': {
          display: 'none !important'
        }
      },
      '@media (orientation: portrait)': {
        '&.landscape': {
          display: 'none !important'
        }
      },
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
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      // disable for mobile
      [theme.breakpoints.up('sm')]: {
        clip: 'rect(0,auto,auto,0)!important',
        clipPath: 'polygon(0px 0px,100% 0px,100% 100%,0px 100%)!important',
        zIndex: 0
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
  content: BackgroundStoryblok & {
    background_data?: LmImagePlaceholder
  }
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

  const BgImage = ({ src, className }: { src: string; className: string }) => (
    <Image
      className={className}
      src={getRootImageUrl(src)}
      {...storyblokImageLoader(src)}
      priority={priorityLoading}
      loading={loading}
      objectFit={background_size === 'auto' ? 'cover' : background_size}
      objectPosition={background_position || 'center'}
      layout="fill"
      {...(content.background_data && {
        placeholder: 'blur',
        blurDataURL: content.background_data.base64
      })}
    />
  )
  console.log('render background image', content._uid)
  const Wrap: FC = ({ children }) => {
    return ['fixed_cover', 'fixed_image'].includes(backgroundStyle || '') ? (
      <div className={classes.rootFixedImage}>
        <div className={classes.fixedCoverImageWrap}>{children}</div>
      </div>
    ) : (
      <>{children}</>
    )
  }

  const defaultImgClassNames = clsx(classes.root, {
    [`hide__${hide_image_on_breakpoint}`]: hide_image_on_breakpoint
  })
  return (
    <Wrap>
      {imageSource && (
        <BgImage
          src={imageSource}
          className={clsx(defaultImgClassNames, {
            landscape: imageSourcePortrait
          })}
        />
      )}
      {imageSourcePortrait && (
        <BgImage
          src={imageSourcePortrait}
          className={clsx(defaultImgClassNames, 'portrait')}
        />
      )}
    </Wrap>
  )
}

export default BackgroundImage
