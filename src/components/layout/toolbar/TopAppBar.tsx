import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Container, { ContainerProps } from '@material-ui/core/Container'
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import { useDebounce } from 'use-debounce'
import shallow from 'zustand/shallow'
import { ContentSpace } from '../ContentSpace'
import useScrollTop from '../../../utils/hooks/useScrollTop'
import { GlobalStoryblok } from '../../../typings/generated/components-schema'
import { useAppStore } from '../../../utils/state/appState'
import {
  leftNavigationDrawerSelector,
  useNavigationStore
} from '../../../utils/state/navigationState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topAppBar: {
      '& .lm-system-bar': {
        transitionDuration: '500ms',
        overflow: 'hidden',
        height: theme.toolbar.height.systemBar,
        [theme.breakpoints.only('xs')]: {
          display: 'none'
        }
      },
      '& .logo-img__invert': {
        display: 'none'
      },
      '& .MuiIconButton-root': {
        color: 'inherit'
      },
      '&.lm-toolbar__unelevated:not(.lm-toolbar__scrolled)': {
        boxShadow: 'none'
      },
      '&.lm-toolbar__text-bold .MuiButton-root': {
        fontWeight: 'bold'
      },
      '&.lm-toolbar__transparent:not(.lm-toolbar__scrolled)': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        '& .MuiButtonBase-root': {
          color: '#fff'
        },
        '& .lm-system-bar': {
          backgroundColor: 'transparent !important'
        },
        '& .logo-img__default': {
          display: 'none'
        },
        '& .logo-img__invert': {
          display: 'block'
        }
      },
      '&.lm-toolbar__scrolled': {
        '& .lm-system-bar': {
          // transform: `translate(0, ${-1 * theme.toolbar.height.systemBar}px)`,
          // transition: 'transform .5s',
          // paddingTop: theme.toolbar.height.systemBar,
          marginTop: -1 * theme.toolbar.height.systemBar
          // height: '0 !important'
        },
        '& .MuiToolbar-root': {
          height: theme.toolbar.height.mobile,
          [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
            height: theme.toolbar.height.landscape
          },
          [theme.breakpoints.up('sm')]: {
            height: theme.toolbar.height.desktop
          }
        }
      },
      '&.lm-toolbar__scroll-collapse.lm-toolbar__collapsed .MuiToolbar-root': {
        height: 0,
        minHeight: 0,
        padding: 0,
        overflow: 'hidden',
        transitionDuration: '300ms'
      }
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
    },
    toolbarCustom: (props: { settings: Partial<GlobalStoryblok> }) => {
      const options: CreateCSSProperties = {}
      const increasedFontSize = props.settings.toolbar_font_size
      if (increasedFontSize) {
        options['& .MuiButton-root'] = {
          fontSize: increasedFontSize as string
        }
      }
      return options
    },
    toolbar: {
      transitionDuration: '500ms',
      height: theme.toolbar.height.mobile,
      [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
        height: theme.toolbar.height.custom
          ? Math.round(theme.toolbar.height.custom * 0.86)
          : theme.toolbar.height.landscape
      },
      [theme.breakpoints.up('sm')]: {
        height: theme.toolbar.height.custom
          ? Math.round(theme.toolbar.height.custom * 1.15)
          : theme.toolbar.height.desktop
      }
    }
  })
)

const mapToolbarColor = {
  primary: 'primary',
  secondary: 'secondary',
  dark: 'inherit',
  white: 'inherit'
}

const TopAppBar: FunctionComponent<{
  SystemBar?: React.ReactNode
}> = (props) => {
  console.log('toppappbarr')
  const { page, settings, drawerVariant } = useAppStore(
    (state) => ({
      page: state.page,
      settings: state.settings,
      drawerVariant: state.drawerVariant
    }),
    shallow
  )
  const classes = useStyles({ settings })
  const toolbarConfig = settings.toolbar_config || []
  const isScrolledTrigger = useScrollTrigger({ disableHysteresis: false })
  const [isScrolled] = useDebounce(isScrolledTrigger, 100)
  const isLeftDrawerOpen = useNavigationStore(leftNavigationDrawerSelector)
  const scrolledWithoutHysteresis = useScrollTop()
  const toolbarVariant = settings.toolbar_variant
  let toolbarWidth: ContainerProps['maxWidth'] = false
  if (toolbarConfig.includes('fixed_width')) {
    toolbarWidth =
      settings.theme_container_width &&
      settings.theme_container_width !== 'none'
        ? settings.theme_container_width
        : 'lg'
  }

  const isFixedTop = toolbarConfig.includes('fixed')
  const isScrollCollapse = toolbarConfig.includes('scroll_collapse')
  const hasFeatureImage = page?.property?.includes('has_feature')
  const drawerBelowToolbar =
    settings.drawer_below_toolbar_xs || settings.drawer_below_toolbar
  const showLeftShift =
    drawerVariant !== 'temporary' && !drawerBelowToolbar && isLeftDrawerOpen

  const toolbarScrolled =
    scrolledWithoutHysteresis &&
    (settings.toolbar_main_height || hasFeatureImage || !!props.SystemBar)
  return (
    <>
      <AppBar
        className={clsx(classes.topAppBar, {
          'lm-toolbar__text-bold': toolbarConfig.includes('text_bold'),
          'lm-toolbar__unelevated': toolbarConfig.includes('unelevated'),
          [`lm-toolbar__${toolbarVariant}`]: toolbarVariant,
          'lm-toolbar__transparent': hasFeatureImage,
          'lm-toolbar__scrolled': toolbarScrolled,
          'lm-toolbar__collapsed':
            isScrolled && settings.toolbar_config?.includes('scroll_collapse'),
          'lm-toolbar__scroll-collapse': isScrollCollapse,
          'lm-toolbar__with-system-bar': !!props.SystemBar,
          [classes.leftShift]: showLeftShift,
          [classes[
            `left-mobile-${settings.mobile_nav_breakpoint || 'sm'}`
          ]]: showLeftShift
        })}
        style={{
          background: settings.toolbar_background ?? undefined,
          backgroundColor:
            settings.toolbar_color?.rgba &&
            (!hasFeatureImage || toolbarScrolled)
              ? settings.toolbar_color?.rgba
              : undefined
        }}
        color={mapToolbarColor[toolbarVariant || 'default']}
        position={isFixedTop ? 'fixed' : 'relative'}
      >
        {props.SystemBar}
        <Container maxWidth={toolbarWidth as ContainerProps['maxWidth']}>
          <Toolbar
            className={clsx(classes.toolbar, {
              [classes.toolbarCustom]: settings.toolbar_font_size
            })}
          >
            {props.children}
          </Toolbar>
        </Container>
      </AppBar>
      {isFixedTop && !hasFeatureImage && <ContentSpace isBlock />}
    </>
  )
}
TopAppBar.displayName = 'TopAppBar'

export default TopAppBar
