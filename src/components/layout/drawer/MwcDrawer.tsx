import React, { FunctionComponent, useEffect } from 'react'
import Drawer, { DrawerProps } from '@material-ui/core/Drawer'
import { useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useAppSetup } from '../../provider/context/AppSetupContext'
import { useGlobalState } from '../../../utils/state/state'
import { UseBackgroundPayload } from '../../section/useBackgroundBox'
import { useStyles } from './useDrawerStyles'

type DrawerContainerProps = {
  backgroundProps?: UseBackgroundPayload
}
const DrawerContainer: FunctionComponent<DrawerContainerProps> = ({
  children,
  backgroundProps
}) => {
  const classes = useStyles()
  const router = useRouter()
  const asPath = router?.asPath
  const [isOpen, setOpen] = useGlobalState('leftNavigationDrawer')
  const appSetup = useAppSetup()
  const theme = useTheme()
  const matches = useMediaQuery(
    theme.breakpoints.down(appSetup.leftDrawerMediaBreakpoint || 'sm')
  )

  const drawerProps: DrawerProps = {
    variant: appSetup.drawerVariant
  }

  useEffect(() => {
    if (appSetup.drawerVariant === 'temporary' || matches) {
      setOpen(false)
    }
  }, [asPath, appSetup, setOpen, matches])

  const classList = backgroundProps?.className
  return (
    <Drawer
      open={isOpen}
      className={clsx('lm-main__drawer', classes.leftDrawer, {
        [classes.aboveToolbar]: !appSetup.drawerBelowToolbar,
        [classes.belowToolbar]: appSetup.drawerBelowToolbar,
        [classes.fullWidthMobile]: appSetup.drawerFullWidthMobile
      })}
      classes={{
        paper: clsx('lm-main__drawer', classList, classes.leftDrawer, {
          [classes.aboveToolbar]: !appSetup.drawerBelowToolbar,
          [classes.belowToolbar]: appSetup.drawerBelowToolbar,
          [classes.fullWidthMobile]: appSetup.drawerFullWidthMobile
        })
      }}
      PaperProps={{
        style: backgroundProps?.style ? backgroundProps.style : undefined
      }}
      onClose={() => setOpen(false)}
      {...drawerProps}
    >
      {children}
    </Drawer>
  )
}
DrawerContainer.displayName = 'DrawerContainer'

export default DrawerContainer
