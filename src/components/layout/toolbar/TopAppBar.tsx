import clsx from 'clsx'
import React, { FC, FunctionComponent } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import Container, { ContainerProps } from '@material-ui/core/Container'
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Slide from '@material-ui/core/Slide'
import { Collapse } from '@material-ui/core'
import { ContentSpace } from '../ContentSpace'
import useScrollTop from '../../../utils/hooks/useScrollTop'
import { GlobalStoryblok } from '../../../typings/generated/components-schema'
import { usePage, useSettings } from '../../provider/SettingsPageProvider'
import {
  drawerVariantSelector,
  leftNavigationDrawerSelector,
  useNavigationStore
} from '../../../utils/state/navigationState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topAppBar: {
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
        '& .MuiToolbar-root': {
          // height: theme.toolbar.height.mobile,
          // [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
          //   height: theme.toolbar.height.landscape
          // },
          // [theme.breakpoints.up('sm')]: {
          //   height: theme.toolbar.height.desktop
          // }
        }
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
      // transitionDuration: '500ms',
      // ...(theme.toolbar.height.custom
      //   ? {}
      //   : {
      // minHeight: theme.toolbar.height.mobile,
      //   [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      //     minHeight: theme.toolbar.height.landscape
      //   },
      //   [theme.breakpoints.up('sm')]: {
      //     minHeight: theme.toolbar.height.desktop
      //   }
      // })
    }
  })
)

const mapToolbarColor = {
  primary: 'primary',
  secondary: 'secondary',
  dark: 'inherit',
  white: 'inherit'
}

const HideOnScroll: FC<{
  isScrollCollapse?: boolean
}> = ({ children, isScrollCollapse }) => {
  const trigger = useScrollTrigger({ disableHysteresis: false })

  if (!isScrollCollapse) {
    return <>{children}</>
  }
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children as any}
    </Slide>
  )
}

const collapsedStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      height: '100%'
    },
    collapsed: {
      '&.lm-collapsed': {
        '& .logo-img': {
          maxHeight: '40px'
        }
      }
    },
    beforeCollapse: {
      '& .lm-toolbar__main': {
        minHeight: theme.toolbar.height.custom
          ? `${theme.toolbar.height.custom}px`
          : `${theme.toolbar.height.mobile}px`,
        [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
          minHeight: theme.toolbar.height.custom
            ? `${Math.round(theme.toolbar.height.custom * 0.86)}px`
            : `${theme.toolbar.height.landscape}px`
        },
        [theme.breakpoints.up('sm')]: {
          minHeight: theme.toolbar.height.custom
            ? `${Math.round(theme.toolbar.height.custom * 1.15)}px`
            : `${theme.toolbar.height.desktop}px`
        }
      }
    }
  })
)

const CollapseCustomHeight: FC = ({ children }) => {
  const trigger = useScrollTrigger({ disableHysteresis: true })
  const theme = useTheme()
  const classes = collapsedStyles()
  if (!theme.toolbar.height.custom) {
    return <>{children}</>
  }
  return (
    <Collapse
      in={!trigger}
      className={clsx(classes.collapsed, { 'lm-collapsed': trigger })}
      classes={{
        wrapper: classes.wrapper,
        entered: classes.beforeCollapse
      }}
      collapsedHeight={theme.toolbar.height.desktop}
    >
      {children}
    </Collapse>
  )
}

const TopAppBar: FunctionComponent<{
  SystemBar?: React.ReactNode
}> = (props) => {
  const settings = useSettings()
  const page = usePage()
  const drawerVariant = useNavigationStore(drawerVariantSelector)

  const classes = useStyles({ settings })
  const toolbarConfig = settings.toolbar_config || []
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
      <HideOnScroll
        isScrollCollapse={toolbarConfig.includes('scroll_collapse')}
      >
        <AppBar
          className={clsx(classes.topAppBar, {
            'lm-toolbar__text-bold': toolbarConfig.includes('text_bold'),
            'lm-toolbar__unelevated': toolbarConfig.includes('unelevated'),
            [`lm-toolbar__${toolbarVariant}`]: toolbarVariant,
            'lm-toolbar__transparent': hasFeatureImage,
            'lm-toolbar__scrolled': toolbarScrolled,
            // 'lm-toolbar__collapsed': isScrolled && isScrollCollapse,
            // 'lm-toolbar__scroll-collapse': isScrollCollapse,
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
          <CollapseCustomHeight>
            <Container maxWidth={toolbarWidth as ContainerProps['maxWidth']}>
              <Toolbar
                disableGutters
                className={clsx('lm-toolbar__main', classes.toolbar, {
                  [classes.toolbarCustom]: settings.toolbar_font_size
                })}
              >
                {props.children}
              </Toolbar>
            </Container>
          </CollapseCustomHeight>
        </AppBar>
      </HideOnScroll>
      {isFixedTop && !hasFeatureImage && <ContentSpace isBlock />}
    </>
  )
}
TopAppBar.displayName = 'TopAppBar'

export default TopAppBar
