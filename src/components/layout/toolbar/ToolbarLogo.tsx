import React from 'react'
import Typography from '@mui/material/Typography'
import { getRootImageUrl } from '../../../utils/imageServices'
import { useHomepageLink } from '../../../utils/hooks/useHomepageLink'
import { usePage, useSettings } from '../../provider/SettingsPageProvider'
import LmSquareImage from '../../avatar/LmSquareImage'
import { makeStyles } from 'tss-react/mui'
import MuiNextLink from '../../link/MuiNextLink'

const useStyles = makeStyles({ name: 'ToolbarLogo' })((theme) => ({
  root: {
    // height: '100%',
    display: 'flex',
    '& .logo-img__mobile': {
      display: 'none'
    },
    [theme.breakpoints.only('xs')]: {
      '& .logo-img__mobile': {
        display: 'flex'
      },
      '& .logo-img__desktop': {
        display: 'none'
      }
    }
  },
  imageContainer: {
    display: 'flex'
  }
}))

export function LmToolbarLogo(): JSX.Element {
  const settings = useSettings()
  const { property } = usePage() || {}
  const { classes, cx } = useStyles()
  const homepageHref = useHomepageLink()
  const websiteTitle = settings.website_title
  const websiteLogo = getRootImageUrl(settings.website_logo)
  const websiteLogoMobile = getRootImageUrl(settings.website_logo_xs)
  const websiteLogoInvert = getRootImageUrl(settings.website_logo_invert)
  const websiteLogoInvertMobile = getRootImageUrl(
    settings.website_logo_invert_xs
  )
  const hasFeature = property?.includes('has_feature')
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
    <div className={cx('lm-logo-container', classes.root)}>
      <MuiNextLink
        href={homepageHref}
        className={cx('lm-logo-header', { 'lm-logo-text': !websiteLogo })}
      >
        {!websiteLogo && <Typography>{websiteTitle}</Typography>}
        {logoImageArray.map(({ isMobile, source, isInvert }) =>
          isInvert && !hasFeature ? null : (
            <div
              className={cx('logo-img', classes.imageContainer, {
                'logo-img__default': !!(
                  (websiteLogoInvert && !isInvert) ||
                  (websiteLogoInvertMobile && !isInvert)
                ),
                'logo-img__invert': !!isInvert,
                'logo-img__mobile': !!isMobile,
                'logo-img__desktop': !!(
                  (source === websiteLogo && websiteLogoMobile) ||
                  (source === websiteLogoInvert && websiteLogoInvertMobile)
                )
              })}
              key={`${source}-${isMobile}-${isInvert}`}
            >
              <LmSquareImage
                image={source as string}
                size={toolbarHeight}
                imageProps={{
                  priority: true,
                  quality: 95,
                  style: {
                    objectFit: 'contain',
                    objectPosition: 'left'
                  },
                  alt: websiteTitle || 'website logo'
                }}
              />
            </div>
          )
        )}
      </MuiNextLink>
    </div>
  )
}
