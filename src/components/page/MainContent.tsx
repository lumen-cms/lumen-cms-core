import React, { FunctionComponent } from 'react'
import clsx from 'clsx'
import { LmComponentRender } from '@LmComponentRender'
import { usePageStyles } from './usePageStyle'
import { usePage, useSettings } from '../provider/SettingsPageProvider'
import {
  drawerVariantSelector,
  leftNavigationDrawerSelector,
  useNavigationStore
} from '../../utils/state/navigationState'

const MainContentContainer: FunctionComponent = ({ children }) => {
  const classes = usePageStyles()
  const settings = useSettings()
  const page = usePage()
  const drawerVariant = useNavigationStore(drawerVariantSelector)
  const isOpen = useNavigationStore(leftNavigationDrawerSelector)
  const hasRightDrawer = page?.right_body?.length

  return (
    <main
      className={clsx(classes.content, {
        [classes.contentWithRight]: hasRightDrawer,
        [classes[`right-mobile-${page?.mobile_breakpoint || 'sm'}`]]: true,
        [classes.leftShift]: drawerVariant !== 'temporary' && isOpen,
        [classes[`left-mobile-${settings.mobile_nav_breakpoint || 'sm'}`]]:
          drawerVariant !== 'temporary' && isOpen
      })}
    >
      {!page.property?.includes('has_feature') &&
        !page.property?.includes('disable_promotion') &&
        settings.promotion?.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      {children}
    </main>
  )
}
MainContentContainer.displayName = 'MainContentContainer'

type MainContentProps = {
  body: any[]
}

export function MainContent({ body }: MainContentProps): JSX.Element {
  return (
    <MainContentContainer>
      {body.map((blok, iteration) => (
        <LmComponentRender
          content={blok}
          key={blok._uid}
          sectionPosition={iteration}
        />
      ))}
    </MainContentContainer>
  )
}
