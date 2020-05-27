import React, { memo } from 'react'
import { GlobalStoryblok } from '../../../typings/generated/components-schema'
import BackgroundImage from '../../section/BackgroundImage'
import BackgroundElements from '../../section/BackgroundElements'
import Link from 'next/link'
import { homepageLinkHandler } from '../../../utils/linkHandler'
import imageService from '../../../utils/ImageService'
import ContentSpace from '../ContentSpace'
import { DrawerContentList } from './DrawerContentList'
import MwcDrawer from './MwcDrawer'
import { useAppSetup } from '../../provider/AppSetupProvider'
import useBackgroundBox from '../../section/useBackgroundBox'
import { CONFIG } from '../../../utils/config'

type DrawerElementProps = {
  settings: GlobalStoryblok
}

function DrawerElement({ settings }: DrawerElementProps): JSX.Element {
  const appSetup = useAppSetup()
  const background = Array.isArray(settings.drawer_background) && settings.drawer_background[0]
  const backgroundProps = useBackgroundBox({ background })
  const websiteTitle = settings.website_title
  const websiteLogo = settings.website_logo
  const websiteSlogan = settings.website_slogan

  return (
    <MwcDrawer backgroundProps={backgroundProps}>
      {(background?.image || background?.background_elements) && <BackgroundImage content={background} />}
      {background?.background_elements && background.background_elements.length > 0 &&
      <BackgroundElements elements={background.background_elements} />}
      <div>
        {appSetup.drawerBelowToolbar && (
          <ContentSpace />
        )}
        {!appSetup.hasDrawer && !appSetup.drawerBelowToolbar && (<div>
          <Link href={CONFIG.href} as={homepageLinkHandler()}>
            <a>
              <div className="p-3">
                {!websiteLogo && websiteTitle}
                {websiteLogo &&
                <img src={imageService(websiteLogo, '0x128')} height="48" alt={websiteTitle || 'website logo'} />}
              </div>
            </a>
          </Link>
          {websiteSlogan && <div>{websiteSlogan}</div>}
        </div>)}
        <DrawerContentList content={settings} />
      </div>
    </MwcDrawer>
  )
}

export default memo(DrawerElement)
