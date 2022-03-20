import React, { FunctionComponent } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { useSettings } from '../provider/SettingsPageProvider'
import {
  drawerVariantSelector,
  leftNavigationDrawerSelector,
  useNavigationStore
} from '../../utils/state/navigationState'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles({ name: 'Footer' })((theme) => ({
  footer: {
    position: 'relative',
    zIndex: theme.zIndex.drawer + 1
  },
  leftShift: {
    marginLeft: theme.drawer.left,
    width: `calc(100% - ${theme.drawer.left})`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.only('xs')]: {
      marginLeft: 0
    }
  }
}))

const FooterContainer: FunctionComponent = ({ children }) => {
  const { classes, cx } = useStyles()
  const isLeftDrawerOpen = useNavigationStore(leftNavigationDrawerSelector)
  const drawerVariant = useNavigationStore(drawerVariantSelector)
  const settings = useSettings()

  const hasLeftShift = drawerVariant !== 'temporary' && isLeftDrawerOpen
  return (
    <footer
      className={cx(classes.footer, {
        [classes.leftShift]: hasLeftShift,
        [classes[`left-mobile-${settings.mobile_nav_breakpoint || 'sm'}`]]:
          hasLeftShift
      })}
    >
      {children}
    </footer>
  )
}
FooterContainer.displayName = 'FooterContainer'

export default function Footer(): JSX.Element {
  const settings = useSettings()
  return (
    <FooterContainer>
      {settings.footer?.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </FooterContainer>
  )
}
