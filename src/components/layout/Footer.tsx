import React, { FunctionComponent } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { useSettings } from '../provider/SettingsPageProvider'
import {
  drawerVariantSelector,
  leftNavigationDrawerSelector,
  useNavigationStore
} from '../../utils/state/navigationState'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

const FooterContainer: FunctionComponent<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const theme = useTheme()
  const isLeftDrawerOpen = useNavigationStore(leftNavigationDrawerSelector)
  const drawerVariant = useNavigationStore(drawerVariantSelector)
  const settings = useSettings()

  const hasLeftShift = drawerVariant !== 'temporary' && isLeftDrawerOpen
  return (
    <Box
      component={'footer'}
      sx={{
        position: 'relative',
        zIndex: theme.zIndex.drawer + 1,
        ...(hasLeftShift && {
          marginLeft: theme.drawer.left,
          width: `calc(100% - ${theme.drawer.left})`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          }),
          [theme.breakpoints.only(settings.mobile_nav_breakpoint || 'xs')]: {
            marginLeft: 0
          }
        })
      }}
    >
      {children}
    </Box>
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
