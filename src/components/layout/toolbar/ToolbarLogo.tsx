import Link from 'next/link'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import MuiLink from '@material-ui/core/Link'
import clsx from 'clsx'
import imageService from '../../../utils/ImageService'
import useDeviceDimensions from '../../../utils/hooks/useDeviceDimensions'
import { LmToolbarLogoProps } from './toolbarTypes'
import { useHomepageLink } from '../../../utils/hooks/useHomepageLink'

export function LmToolbarLogo({ settings }: LmToolbarLogoProps): JSX.Element {
  const homepageHref = useHomepageLink()
  const websiteTitle = settings.website_title
  const websiteLogo = settings.website_logo
  const websiteLogoInvert = settings.website_logo_invert
  const height = settings.toolbar_main_height
    ? settings.toolbar_main_height * 2
    : 48 * 2

  const { isMobile } = useDeviceDimensions()

  // todo rewrite to intrinsic image
  const getImageSrc = (image: string) => imageService(image, `0x${height}`)

  return (
    <div className="h-100 d-inline-block">
      <Link href={homepageHref} passHref>
        <MuiLink
          className={clsx('lm-logo-header', { 'lm-logo-text': !websiteLogo })}
        >
          <>
            {!websiteLogo && <Typography>{websiteTitle}</Typography>}
            {websiteLogo && (
              <img
                src={getImageSrc(
                  isMobile && settings.website_logo_xs
                    ? settings.website_logo_xs
                    : websiteLogo
                )}
                className={`lm-logo-img${
                  websiteLogoInvert ? ' lm-logo__default' : ''
                }`}
                alt={websiteTitle || 'website logo'}
              />
            )}
            {websiteLogoInvert && (
              <img
                src={getImageSrc(
                  isMobile && settings.website_logo_invert_xs
                    ? settings.website_logo_invert_xs
                    : websiteLogoInvert
                )}
                className={`lm-logo-img${
                  websiteLogoInvert ? ' lm-logo__inverted' : ''
                }`}
                alt={websiteTitle || 'website logo'}
              />
            )}
          </>
        </MuiLink>
      </Link>
    </div>
  )
}
