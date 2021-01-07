import React, { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { useAppSettings } from '@context/AppSettingsContext'
import BackgroundImage from '../../section/BackgroundImage'
import BackgroundElements from '../../section/BackgroundElements'
import {
  getOriginalImageDimensions,
  getRootImageUrl,
  imageSizesOnWidthAndBreakpoints
} from '../../../utils/ImageService'
import { ContentSpace } from '../ContentSpace'
import { DrawerContentList } from './DrawerContentList'
import MwcDrawer from './MwcDrawer'
import useBackgroundBox from '../../section/useBackgroundBox'
import { useHomepageLink } from '../../../utils/hooks/useHomepageLink'

const useStyles = makeStyles({
  logoRoot: {
    '& > div': {
      height: '40px'
    }
  },
  logo: {
    objectFit: 'contain',
    objectPosition: 'left'
  }
})

function DrawerElement(): JSX.Element {
  console.log('drwer element rendered')
  const { settings } = useAppSettings()
  const homepageHref = useHomepageLink()
  const { breakpoints } = useTheme()
  const classes = useStyles()
  const background = Array.isArray(settings.drawer_background)
    ? settings.drawer_background[0]
    : undefined
  const backgroundProps = useBackgroundBox({ background })
  const websiteTitle = settings.website_title
  const websiteLogo = settings.website_logo
  const websiteSlogan = settings.website_slogan
  const drawerBelowToolbar =
    settings.drawer_below_toolbar_xs || settings.drawer_below_toolbar
  return (
    <MwcDrawer backgroundProps={backgroundProps}>
      {(background?.image || background?.background_elements) && (
        <BackgroundImage content={background} />
      )}
      {background?.background_elements &&
        background.background_elements.length > 0 && (
          <BackgroundElements elements={background.background_elements} />
        )}
      <div>
        {drawerBelowToolbar && <ContentSpace />}
        {!settings.drawer_body?.length && !drawerBelowToolbar && (
          <div>
            <Link href={homepageHref}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a>
                <div className={clsx('p-3', classes.logoRoot)}>
                  {!websiteLogo && { websiteTitle }}
                  {websiteLogo && (
                    <Image
                      src={getRootImageUrl(websiteLogo)}
                      layout="intrinsic"
                      {...getOriginalImageDimensions(websiteLogo)}
                      className={classes.logo}
                      sizes={imageSizesOnWidthAndBreakpoints(360, breakpoints)}
                    />
                  )}
                </div>
              </a>
            </Link>
            {websiteSlogan && <div>{websiteSlogan}</div>}
          </div>
        )}
        <DrawerContentList />
      </div>
    </MwcDrawer>
  )
}

export default memo(DrawerElement)
