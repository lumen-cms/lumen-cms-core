import Link from 'next/link'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import MuiLink from '@material-ui/core/Link'
import clsx from 'clsx'
import Image from 'next/image'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  getOriginalImageDimensions,
  getRootImageUrl
} from '../../../utils/ImageService'
import { LmToolbarLogoProps } from './toolbarTypes'
import { useHomepageLink } from '../../../utils/hooks/useHomepageLink'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiLink-root > div, & .MuiLink-root > div > div': {
      height: '100%'
    },
    '& .logo-img__mobile': {
      display: 'none'
    },
    [theme.breakpoints.only('xs')]: {
      '& .logo-img__mobile': {
        display: 'block'
      },
      '& .logo-img:not(.logo-img__mobile)': {
        display: 'none'
      }
    }
  }
}))

export function LmToolbarLogo({ settings }: LmToolbarLogoProps): JSX.Element {
  const classes = useStyles()
  const homepageHref = useHomepageLink()
  const websiteTitle = settings.website_title
  const websiteLogo = getRootImageUrl(settings.website_logo)
  const websiteLogoMobile = getRootImageUrl(settings.website_logo_xs)
  const websiteLogoInvert = getRootImageUrl(settings.website_logo_invert)
  const websiteLogoInvertMobile = getRootImageUrl(
    settings.website_logo_invert_xs
  )

  const logoImageArray: {
    source?: string
    isMobile?: boolean
    isInvert?: boolean
    dimensions: {
      width: number
      height: number
    }
  }[] = [
    {
      source: websiteLogo,
      dimensions: getOriginalImageDimensions(websiteLogo)
    },
    {
      source: websiteLogoMobile,
      isMobile: true,
      dimensions: getOriginalImageDimensions(websiteLogoMobile)
    },
    {
      source: websiteLogoInvert,
      isInvert: true,
      dimensions: getOriginalImageDimensions(websiteLogoInvert)
    },
    {
      source: websiteLogoInvertMobile,
      isInvert: true,
      isMobile: true,
      dimensions: getOriginalImageDimensions(websiteLogoInvertMobile)
    }
  ].filter((i) => i.source)

  const height = settings.toolbar_main_height
    ? settings.toolbar_main_height
    : 40

  // const { isMobile } = useDeviceDimensions()

  // todo rewrite to intrinsic image
  // const getImageSrc = (image: string) => imageService(image, `0x${height}`)

  return (
    <div className={clsx('h-100 d-inline-block', classes.root)}>
      <Link href={homepageHref} passHref>
        <MuiLink
          className={clsx('lm-logo-header', { 'lm-logo-text': !websiteLogo })}
        >
          {!websiteLogo && <Typography>{websiteTitle}</Typography>}
          {logoImageArray.map(({ isMobile, dimensions, source, isInvert }) => (
            <div
              style={{
                width: Math.round(
                  (height / dimensions.height) * dimensions.width
                ),
                height
              }}
              key={`${source}-${isMobile}-${isInvert}`}
            >
              <Image
                src={source as string}
                priority
                loading="eager"
                width={dimensions.width}
                height={dimensions.height}
                alt={websiteTitle || 'website logo'}
                layout="intrinsic"
                className={clsx('logo-img', {
                  logo__default: websiteLogoInvert && !isInvert,
                  logo__invert: isInvert,
                  logo__mobile: isMobile
                })}
              />
            </div>
          ))}
        </MuiLink>
      </Link>
    </div>
  )
}
