import Link from 'next/link'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import MuiLink from '@material-ui/core/Link'
import clsx from 'clsx'
import Image from 'next/image'
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import {
  getOriginalImageDimensions,
  getRootImageUrl,
  imageSizesOnWidthAndBreakpoints
} from '../../../utils/ImageService'
import { useHomepageLink } from '../../../utils/hooks/useHomepageLink'
import { useSettings } from '../../provider/SettingsPageProvider'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .logo-img': {
      position: 'relative',
      '& > div > div': {
        height: '100%' // need to set see if intrinsic image changes over time
      },
      '& img': {
        objectFit: 'contain',
        objectPosition: 'left'
      }
    },
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
      '& .logo-img__default, & .logo-img__desktop': {
        display: 'none'
      }
    }
  }
}))

export function LmToolbarLogo(): JSX.Element {
  const settings = useSettings()
  const classes = useStyles()
  const { breakpoints } = useTheme()
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

  return (
    <div className={clsx('h-100 d-inline-block', classes.root)}>
      <Link href={homepageHref} passHref>
        <MuiLink
          className={clsx('lm-logo-header', { 'lm-logo-text': !websiteLogo })}
        >
          {!websiteLogo && <Typography>{websiteTitle}</Typography>}
          {logoImageArray.map(({ isMobile, dimensions, source, isInvert }) => (
            <div
              className={clsx('logo-img', {
                'logo-img__default':
                  (websiteLogoInvert && !isInvert) ||
                  (websiteLogoInvertMobile && !isInvert),
                'logo-img__invert': isInvert,
                'logo-img__mobile': isMobile,
                'logo-img__desktop':
                  (source === websiteLogo && websiteLogoMobile) ||
                  (source === websiteLogoInvert && !isInvert)
              })}
              key={`${source}-${isMobile}-${isInvert}`}
            >
              <Image
                src={source as string}
                priority
                loading="eager"
                alt={websiteTitle || 'website logo'}
                layout="intrinsic"
                sizes={imageSizesOnWidthAndBreakpoints(
                  dimensions.width,
                  breakpoints
                )}
                quality={95}
                {...dimensions}
              />
            </div>
          ))}
        </MuiLink>
      </Link>
    </div>
  )
}
