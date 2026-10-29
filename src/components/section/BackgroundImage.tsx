import React from 'react'
import Image from 'next/image'
import {
  BackgroundStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'
import { getRootImageUrl } from '../../utils/imageServices'
import { storyblokImageLoader } from '../../utils/storyblokImageLoader'
import { LmImagePlaceholder } from '../image/imageTypes'
import Box from '@mui/material/Box'
import { styled, Theme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'
import clsx from 'clsx'

const BackgroundImageRoot = styled(Image)(({ theme }) => ({
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
    [theme.breakpoints.down('md')]: {
      display: 'none !important'
    }
  },
  '&.hide__md': {
    [theme.breakpoints.down('lg')]: {
      display: 'none !important'
    }
  }
}))

const rootFixedImageSx = (theme: Theme): SystemStyleObject<Theme> => ({
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
})

const fixedCoverImageWrapSx = (theme: Theme): SystemStyleObject<Theme> => ({
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
})

type BackgroundImageProps = {
  content: BackgroundStoryblok & {
    background_data?: LmImagePlaceholder
  }
  backgroundStyle?: SectionStoryblok['background_style']
  sectionPosition?: number
}

function BgImage({
  src,
  className,
  content,
  sectionPosition
}: Pick<BackgroundImageProps, 'content' | 'sectionPosition'> & {
  src: string
  className: string
}) {
  const {
    background_position,
    background_size,
    priority,
    disable_lazy_loading,
    // image_focal_point,
    // used for quality of background image
    quality
  } = content

  const priorityLoading = priority || sectionPosition === 0
  const loading = priorityLoading
    ? undefined
    : disable_lazy_loading
    ? 'eager'
    : undefined
  // const rootImageUrl = `${getRootImageUrl(src)}${
  //   image_focal_point ? `?focalPoint=${image_focal_point}` : ''
  // }`
  return (
    <BackgroundImageRoot
      className={className}
      alt={'bg image ' + src}
      src={getRootImageUrl(src)}
      {...storyblokImageLoader(src)}
      priority={priorityLoading}
      quality={
        quality
          ? isNaN(Number(quality))
            ? undefined
            : Number(quality)
          : undefined
      }
      loading={loading}
      style={{
        objectFit:
          background_size === 'auto' ? 'cover' : background_size || 'cover',
        objectPosition: background_position || 'center'
      }}
      fill
    />
  )
}

function Wrap({
  children,
  backgroundStyle
}: React.PropsWithChildren<Pick<BackgroundImageProps, 'backgroundStyle'>>) {
  return ['fixed_cover', 'fixed_image'].includes(backgroundStyle || '') ? (
    <Box sx={rootFixedImageSx}>
      <Box sx={fixedCoverImageWrapSx}>{children}</Box>
    </Box>
  ) : (
    <>{children}</>
  )
}

const BackgroundImage = ({
  content,
  backgroundStyle,
  sectionPosition
}: BackgroundImageProps): React.JSX.Element | null => {
  const {
    image: imageSource,
    alternative_image: imageSourcePortrait,
    hide_image_on_breakpoint
  } = content
  const defaultImgClassNames = clsx({
    [`hide__${hide_image_on_breakpoint}`]: !!hide_image_on_breakpoint
  })
  return (
    <Wrap backgroundStyle={backgroundStyle}>
      {imageSource && (
        <BgImage
          content={content}
          sectionPosition={sectionPosition}
          src={imageSource}
          className={clsx(defaultImgClassNames, {
            landscape: !!imageSourcePortrait
          })}
        />
      )}
      {imageSourcePortrait && (
        <BgImage
          content={content}
          sectionPosition={sectionPosition}
          src={imageSourcePortrait}
          className={clsx(defaultImgClassNames, 'portrait')}
        />
      )}
    </Wrap>
  )
}

export default BackgroundImage
