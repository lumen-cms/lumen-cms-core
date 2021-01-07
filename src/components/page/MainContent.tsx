import React, { FunctionComponent } from 'react'
import clsx from 'clsx'
import { LmComponentRender } from '@LmComponentRender'
import { usePageStyles } from './usePageStyle'
import { useGlobalState } from '../../utils/state/state'
import { useAppStore } from '../../utils/state/appState'

const MainContentContainer: FunctionComponent = ({ children }) => {
  const classes = usePageStyles()
  const { page, settings, drawerVariant } = useAppStore((state) => ({
    page: state.page,
    settings: state.settings,
    drawerVariant: state.drawerVariant
  }))
  const [isOpen] = useGlobalState('leftNavigationDrawer')
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
