import React, { FunctionComponent } from 'react'
import clsx from 'clsx'
import { LmComponentRender } from '@LmComponentRender'
import { usePageStyles } from './usePageStyle'
import {
  drawerVariantSelector,
  pageSelector,
  settingsSelector,
  useAppStore
} from '../../utils/state/appState'
import {
  leftNavigationDrawerSelector,
  useNavigationStore
} from '../../utils/state/navigationState'

const MainContentContainer: FunctionComponent = ({ children }) => {
  const classes = usePageStyles()
  const settings = useAppStore(settingsSelector)
  const page = useAppStore(pageSelector)
  const drawerVariant = useAppStore(drawerVariantSelector)

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
