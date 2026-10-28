import React, { FC } from 'react'
import AppBar from '@mui/material/AppBar'
import { usePage, useSettings } from '../../provider/SettingsPageProvider'
import {
  drawerVariantSelector,
  leftNavigationDrawerSelector,
  useNavigationStore
} from '../../../utils/state/navigationState'
import useScrollTop from '../../../utils/hooks/useScrollTop'
import { Theme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'
import clsx from 'clsx'

const mapToolbarColor: Record<
  string,
  import('@mui/material/AppBar').AppBarProps['color']
> = {
  primary: 'primary',
  secondary: 'secondary',
  dark: 'inherit',
  white: 'inherit'
}

const topAppBarSx = (theme: Theme): SystemStyleObject<Theme> => ({
  '& .logo-img__invert': {
    display: 'none'
  },
  '&.lm-toolbar__has-feature': {
    backgroundColor: 'transparent',
    '& .MuiButtonBase-root': {
      color: '#fff'
    },
    '& .lm-system-bar': {
      backgroundColor: 'transparent !important'
    },
    '& .logo-img__default': {
      display: 'none'
    },
    '& .logo-img__invert:not(.logo-img__mobile)': {
      display: 'block'
    },
    [theme.breakpoints.only('xs')]: {
      '& .logo-img__mobile.logo-img__invert': {
        display: 'block'
      },
      '& .logo-img__invert.logo-img__desktop:not(.logo-img__mobile)': {
        display: 'none'
      }
    }
  },
  '& .MuiIconButton-root': {
    color: 'inherit'
  },
  '&.lm-toolbar__text-bold .MuiButton-root': {
    fontWeight: 'bold'
  }
})

const leftShiftSx = (theme: Theme): SystemStyleObject<Theme> => ({
  marginLeft: theme.drawer.left,
  width: `calc(100% - ${theme.drawer.left})`,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  [theme.breakpoints.only('xs')]: {
    marginLeft: 0
  }
})

const LmTopAppContainer: FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const settings = useSettings()
  const page = usePage() || {}
  const drawerVariant = useNavigationStore(drawerVariantSelector)
  const toolbarConfig = settings.toolbar_config || []
  const isLeftDrawerOpen = useNavigationStore(leftNavigationDrawerSelector)
  const scrolledWithoutHysteresis = useScrollTop()
  const toolbarVariant = settings.toolbar_variant
  const isFixedTop = toolbarConfig.includes('fixed')
  const hasFeatureImage = !!page.property?.includes('has_feature')
  const drawerBelowToolbar =
    settings.drawer_below_toolbar_xs || settings.drawer_below_toolbar
  const showLeftShift =
    drawerVariant !== 'temporary' && !drawerBelowToolbar && isLeftDrawerOpen

  const toolbarScrolled = scrolledWithoutHysteresis && hasFeatureImage

  const elevation =
    !scrolledWithoutHysteresis &&
    (hasFeatureImage || toolbarConfig.includes('unelevated'))
      ? 0
      : settings.toolbar_elevation
      ? Number(settings.toolbar_elevation)
      : 4
  return (
    <AppBar
      elevation={elevation}
      className={clsx({
        'lm-toolbar__has-feature':
          !scrolledWithoutHysteresis && hasFeatureImage,
        'lm-toolbar__text-bold': toolbarConfig.includes('text_bold'),
        [`lm-toolbar__${toolbarVariant}`]: !!toolbarVariant
      })}
      sx={[topAppBarSx, showLeftShift && leftShiftSx]}
      style={{
        background: settings.toolbar_background ?? undefined,
        backgroundColor:
          settings.toolbar_color?.rgba && (!hasFeatureImage || toolbarScrolled)
            ? settings.toolbar_color?.rgba ?? undefined
            : undefined
      }}
      color={mapToolbarColor[toolbarVariant || 'default']}
      position={isFixedTop ? 'fixed' : 'relative'}
    >
      {children}
    </AppBar>
  )
}

export default LmTopAppContainer
