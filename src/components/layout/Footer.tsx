import React, { FunctionComponent, memo } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { useGlobalState } from '../../utils/state/state'
import { GlobalStoryblok } from '../../typings/generated/components-schema'
import { useAppSetup } from '../provider/context/AppSetupContext'
import { LmComponentRender } from '../CoreComponents'

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
  const appSetup = useAppSetup()
  const hasLeftShift =
    appSetup.drawerVariant !== 'temporary' && isLeftDrawerOpen
  return (
    <footer
      className={clsx(classes.footer, {
        [classes.leftShift]: hasLeftShift,
        [classes[
          `left-mobile-${appSetup.leftDrawerMediaBreakpoint || 'sm'}`
        ]]: hasLeftShift
      })}
    >
      {children}
    </footer>
  )
}
FooterContainer.displayName = 'FooterContainer'

type FooterProps = {
  settings: GlobalStoryblok
}

function Footer({ settings }: FooterProps): JSX.Element {
  const content = (settings && settings.footer) || []

  return (
    <FooterContainer>
      {content.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </FooterContainer>
  )
}

export default memo(Footer)
