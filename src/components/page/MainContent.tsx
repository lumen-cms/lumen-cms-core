import React, { FunctionComponent } from 'react'
import { usePageStyles } from './usePageStyle'
import clsx from 'clsx'
import { useGlobalState } from '../../utils/state/state'
import { useAppSetup } from '../provider/AppSetupProvider'
import { useAppContext } from '../provider/AppProvider'

const MainContentContainer: FunctionComponent = ({ children }) => {
  const classes = usePageStyles()
  const appSetup = useAppSetup()
  const [isOpen] = useGlobalState('leftNavigationDrawer')
  return <main
    className={clsx(classes.content, {
        [classes.contentWithRight]: appSetup.hasRightDrawer,
        [classes[`right-mobile-${appSetup.rightDrawerMediaBreakpoint || 'sm'}`]]: true,
        [classes.leftShift]: appSetup.drawerVariant !== 'temporary' && isOpen,
        [classes[`left-mobile-${appSetup.leftDrawerMediaBreakpoint || 'sm'}`]]: appSetup.drawerVariant !== 'temporary' && isOpen
      }
    )}>{children}</main>
}
MainContentContainer.displayName = 'MainContentContainer'

type MainContentProps = {
  body: any[]
}

export function MainContent({ body }: MainContentProps): JSX.Element {
  const { ComponentRender } = useAppContext()

  return (
    <MainContentContainer>
      {body.map((blok, i) => ComponentRender({ content: blok, i }))}
    </MainContentContainer>
  )
}


export default MainContent
