import Link from 'next/link'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import MuiLink from '@material-ui/core/Link'
import clsx from 'clsx'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { getRootImageUrl } from '../../../utils/imageServices'
import { useHomepageLink } from '../../../utils/hooks/useHomepageLink'
import { useSettings } from '../../provider/SettingsPageProvider'
import LmSquareImage from '../../avatar/LmSquareImage'

const heightCalculation = (value: number) => value - 24

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // height: '100%',
      display: 'flex',
      [theme.breakpoints.only('xs')]: {
        '& .logo-img__mobile': {
          display: 'block'
        },
        '& .logo-img__desktop': {
          display: 'none'
        }
      }
    },
    imageContainer: {
      display: 'flex'
    }
  })
)

export function LmToolbarLogo(): JSX.Element {
  const settings = useSettings()
  const classes = useStyles()
  const homepageHref = useHomepageLink()
  const websiteTitle = settings.website_title
  const websiteLogo = getRootImageUrl(settings.website_logo)
  const websiteLogoMobile = getRootImageUrl(settings.website_logo_xs)
  const websiteLogoInvert = getRootImageUrl(settings.website_logo_invert)
  const websiteLogoInvertMobile = getRootImageUrl(
    settings.website_logo_invert_xs
  )
  const toolbarHeight = settings.toolbar_main_height
    ? Number(settings.toolbar_main_height) - 24
    : 40

  const logoImageArray: {
    source?: string
    isMobile?: boolean
    isInvert?: boolean
  }[] = [
    {
      source: websiteLogo
    },
    {
      source: websiteLogoMobile,
      isMobile: true
    },
    {
      source: websiteLogoInvert,
      isInvert: true
    },
    {
      source: websiteLogoInvertMobile,
      isInvert: true,
      isMobile: true
    }
  ].filter((i) => i.source)

  return (
    <div className={clsx('lm-logo-container', classes.root)}>
      <Link href={homepageHref} passHref>
        <MuiLink
          className={clsx('lm-logo-header', { 'lm-logo-text': !websiteLogo })}
        >
          {!websiteLogo && <Typography>{websiteTitle}</Typography>}
          {logoImageArray.map(({ isMobile, source, isInvert }) => (
            <div
              className={clsx('logo-img', classes.imageContainer, {
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
              <LmSquareImage
                image={source as string}
                size={toolbarHeight}
                layout="intrinsic"
                imageProps={{
                  priority: true,
                  quality: 95,
                  objectFit: 'contain',
                  objectPosition: 'left',
                  alt: websiteTitle || 'website logo'
                }}
              />
            </div>
          ))}
        </MuiLink>
      </Link>
    </div>
  )
}
