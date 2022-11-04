import React from 'react'
import Link from 'next/link'
import BackgroundImage from '../../section/BackgroundImage'
import BackgroundElements from '../../section/BackgroundElements'
import { ContentSpace } from '../ContentSpace'
import { DrawerContentList } from './DrawerContentList'
import MwcDrawer from './MwcDrawer'
import useBackgroundBox from '../../section/useBackgroundBox'
import { useSettings } from '../../provider/SettingsPageProvider'
import { useHomepageLink } from '../../../utils/hooks/useHomepageLink'
import LmSquareImage from '../../avatar/LmSquareImage'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles({ name: 'DrawerElement' })({
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

function DrawerLogoArea() {
  const settings = useSettings()
  const homepageHref = useHomepageLink()
  const { classes, cx } = useStyles()

  const websiteTitle = settings.website_title
  const websiteLogo = settings.website_logo
  const websiteSlogan = settings.website_slogan
  return (
    <div>
      <Link href={homepageHref}>
        <div className={cx('p-3', classes.logoRoot)}>
          {!websiteLogo && websiteTitle && <>{websiteTitle}</>}
          {websiteLogo && (
            <LmSquareImage
              image={websiteLogo}
              imageProps={{ alt: websiteTitle || 'website logo' }}
              size={40}
            />
          )}
        </div>
      </Link>
      {websiteSlogan && <div>{websiteSlogan}</div>}
    </div>
  )
}

function DrawerElement(): JSX.Element {
  const settings = useSettings()

  const background = Array.isArray(settings.drawer_background)
    ? settings.drawer_background[0]
    : undefined
  const backgroundProps = useBackgroundBox({ background })

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
          <DrawerLogoArea />
        )}
        <DrawerContentList />
      </div>
    </MwcDrawer>
  )
}

export default DrawerElement
