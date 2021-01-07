import React, { FunctionComponent } from 'react'
import clsx from 'clsx'
import { useAppSetup } from '@context/AppSetupContext'
import { LmComponentRender } from '@LmComponentRender'
import { usePageStyles } from './usePageStyle'
import { useGlobalState } from '../../utils/state/state'
import { useAppStore } from '../../utils/state/appState'

const MainContentContainer: FunctionComponent = ({ children }) => {
  const classes = usePageStyles()
  const appSetup = useAppSetup()
  const { page, settings } = useAppStore((state) => ({
    page: state.page,
    settings: state.settings
  }))
  const [isOpen] = useGlobalState('leftNavigationDrawer')
  const hasRightDrawer = page?.right_body?.length

  return (
    <main
      className={clsx(classes.content, {
        [classes.contentWithRight]: hasRightDrawer,
        [classes[`right-mobile-${page?.mobile_breakpoint || 'sm'}`]]: true,
        [classes.leftShift]: appSetup.drawerVariant !== 'temporary' && isOpen,
        [classes[`left-mobile-${settings.mobile_nav_breakpoint || 'sm'}`]]:
          appSetup.drawerVariant !== 'temporary' && isOpen
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
