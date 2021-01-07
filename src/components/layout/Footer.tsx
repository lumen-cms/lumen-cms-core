import React, { FunctionComponent, memo } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { LmComponentRender } from '@LmComponentRender'
import { useGlobalState } from '../../utils/state/state'
import { useAppStore } from '../../utils/state/appState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
)

const FooterContainer: FunctionComponent = ({ children }) => {
  const classes = useStyles()
  const [isLeftDrawerOpen] = useGlobalState('leftNavigationDrawer')
  const { settings, drawerVariant } = useAppStore((state) => ({
    settings: state.settings,
    drawerVariant: state.drawerVariant
  }))
  const hasLeftShift = drawerVariant !== 'temporary' && isLeftDrawerOpen
  return (
    <footer
      className={clsx(classes.footer, {
        [classes.leftShift]: hasLeftShift,
        [classes[
          `left-mobile-${settings.mobile_nav_breakpoint || 'sm'}`
        ]]: hasLeftShift
      })}
    >
      {children}
    </footer>
  )
}
FooterContainer.displayName = 'FooterContainer'

function Footer(): JSX.Element {
  const settings = useAppStore((state) => state.settings)
  return (
    <FooterContainer>
      {settings.footer?.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </FooterContainer>
  )
}

export default memo(Footer)
