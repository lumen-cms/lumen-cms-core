import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { GlobalStoryblok } from '../../../typings/generated/components-schema'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Container, { ContainerProps } from '@material-ui/core/Container'
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles'
import { useGlobalState } from '../../../utils/state/state'
import ContentSpace from '../ContentSpace'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import { useAppSetup } from '../../provider/AppSetupProvider'
import useScrollTop from '../../../utils/hooks/useScrollTop'
import { useDebounce } from 'use-debounce'

export type AppHeaderProps = {
  settings: GlobalStoryblok
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  topAppBar: {
    '& .lm-system-bar': {
      transitionDuration: '500ms',
      overflow: 'hidden',
      height: theme.toolbar.height.systemBar,
      [theme.breakpoints.only('xs')]: {
        display: 'none'
      }
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
      }
    },
    '&.lm-toolbar__scrolled': {
      '& .lm-system-bar': {
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
  topAppBarCustom: (props: AppHeaderProps) => {
    const options: CreateCSSProperties<{}> = {}
    if (props.settings?.toolbar_color?.rgba) {
      options.backgroundColor = `${props.settings.toolbar_color.rgba} !important`
    }
    return options
  },
  toolbarCustom: (props: AppHeaderProps) => {
    const options: CreateCSSProperties<{}> = {}
    const increasedFontSize = props.settings.toolbar_font_size
    if (increasedFontSize) {
      options['& .MuiButton-root'] = {
        fontSize: increasedFontSize as string
      }
    }
    return options
  },
  toolbar: {
    height: theme.toolbar.height.custom ? Number(theme.toolbar.height.custom) : theme.toolbar.height.mobile,
    transitionDuration: '500ms',
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      height: theme.toolbar.height.custom ? Math.round(theme.toolbar.height.custom * 0.86) : theme.toolbar.height.landscape
    },
    [theme.breakpoints.up('sm')]: {
      height: theme.toolbar.height.custom ? Math.round(theme.toolbar.height.custom * 1.15) : theme.toolbar.height.desktop
    }
  }
}))

const mapToolbarColor = {
  'primary': 'primary',
  'secondary': 'secondary',
  'dark': 'inherit',
  'white': 'inherit'
}

const TopAppBar: FunctionComponent<AppHeaderProps & {
  SystemBar?: React.ReactNode
}> = (props) => {
  const classes = useStyles(props)
  const { settings } = props
  const toolbarConfig = settings.toolbar_config || []
  const appSetup = useAppSetup()
  const isScrolledTrigger = useScrollTrigger({ disableHysteresis: false })
  const [isScrolled] = useDebounce(isScrolledTrigger, 100)
  const [isLeftDrawerOpen] = useGlobalState('leftNavigationDrawer')
  const scrolledWithoutHysteresis = useScrollTop()
  const toolbarVariant = settings.toolbar_variant
  let toolbarWidth: ContainerProps['maxWidth'] = false
  if (toolbarConfig.includes('fixed_width')) {
    toolbarWidth = settings.theme_container_width && settings.theme_container_width !== 'none' ? settings.theme_container_width : 'lg'
  }

  const isFixedTop = toolbarConfig.includes('fixed')
  const isScrollCollapse = toolbarConfig.includes('scroll_collapse')
  const showLeftShift = appSetup.drawerVariant !== 'temporary' && !appSetup.drawerBelowToolbar && isLeftDrawerOpen

  return (
    <>
      <AppBar className={clsx(classes.topAppBar, {
        'lm-toolbar__text-bold': toolbarConfig.includes('text_bold'),
        'lm-toolbar__unelevated': toolbarConfig.includes('unelevated'),
        [`lm-toolbar__${toolbarVariant}`]: toolbarVariant,
        'lm-toolbar__transparent': appSetup.hasFeatureImage,
        'lm-toolbar__scrolled': scrolledWithoutHysteresis && (appSetup.toolbarMainHeight || appSetup.hasFeatureImage || !!props.SystemBar),
        'lm-toolbar__collapsed': isScrolled && appSetup.hasScrollCollapse,
        'lm-toolbar__scroll-collapse': isScrollCollapse,
        'lm-toolbar__with-system-bar': !!props.SystemBar,
        [classes.topAppBarCustom]: props.settings?.toolbar_color?.rgba,
        [classes.leftShift]: showLeftShift,
        [classes[`left-mobile-${appSetup.leftDrawerMediaBreakpoint || 'sm'}`]]: showLeftShift
      })}
              color={mapToolbarColor[toolbarVariant || 'default']}
              position={isFixedTop ? 'fixed' : 'relative'}>
        {props.SystemBar}
        <Container maxWidth={toolbarWidth as ContainerProps['maxWidth']}>
          <Toolbar className={clsx(classes.toolbar, {
            [classes.toolbarCustom]: props.settings.toolbar_font_size
          })}>
            {props.children}
          </Toolbar>
        </Container>
      </AppBar>
      {isFixedTop && !appSetup.hasFeatureImage && <ContentSpace />}
    </>
  )
}
TopAppBar.displayName = 'TopAppBar'

export default TopAppBar
