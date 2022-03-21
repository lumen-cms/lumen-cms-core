import {
  alpha,
  createTheme,
  responsiveFontSizes,
  ThemeProvider
} from '@mui/material/styles'
import React, { FunctionComponent, useMemo } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import parseFont from '../../utils/parseFont'
import { LmGlobalStyles } from './LmGlobalStyles'
import { usePage, useSettings } from '../provider/SettingsPageProvider'
import { grey } from '@mui/material/colors'
import { Color } from '@mui/material'
import { ResponsiveFontSizesOptions } from '@mui/material/styles/responsiveFontSizes'

declare module '@mui/material/styles' {
  interface Palette {
    grey: Color
  }
}

declare module '@mui/material/Fab' {
  interface ButtonPropsColorOverrides {
    grey: true
  }
}

declare module '@mui/material/IconButton' {
  interface ButtonPropsColorOverrides {
    grey: true
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    grey: true
  }
}
declare module '@mui/material' {
  interface Color {
    main: string
    dark: string
  }
}

declare module '@mui/material/styles/createTheme' {
  interface Theme {
    defaultContainerWidth: string | boolean
    drawer: {
      left: string
      right: string
    }
    toolbar: {
      progressColor?: string
      height: {
        mobile: number
        landscape: number
        desktop: number
        custom?: number
        systemBar: number
      }
    }
    alternativeFont: {
      alt1: string
      alt2: string
      alt3: string
      alt4: string
    }
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    defaultContainerWidth?: string | boolean
    drawer: {
      left: string
      right: string
    }
    toolbar: {
      progressColor?: string
      height: {
        mobile: number
        landscape: number
        desktop: number
        custom?: number
        systemBar: number
      }
    }
    alternativeFont?: {
      alt1?: string
      alt2?: string
      alt3?: string
      alt4?: string
    }
  }
}

const mapThemeType = {
  base: 'light',
  dark: 'dark'
}
const responsiveFontSizeOptions: ResponsiveFontSizesOptions = {
  breakpoints: ['sm', 'md', 'lg']
}

const { palette } = createTheme()
const { augmentColor, getContrastText } = palette

const GlobalTheme: FunctionComponent = ({ children }) => {
  const settings = useSettings()
  const page = usePage()

  const rightDrawerWidth = page?.right_drawer_width

  const themeUid = settings && settings._uid
  const theme = useMemo(() => {
    if (!themeUid) {
      return responsiveFontSizes(createTheme(), responsiveFontSizeOptions)
    }

    if (!settings.theme_font_default) {
      settings.theme_font_default =
        'Nunito:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700'
    }
    let defaultContainerWidth: string | boolean = 'lg'
    if (settings.theme_container_width) {
      defaultContainerWidth =
        settings.theme_container_width === 'none'
          ? false
          : settings.theme_container_width
    }

    const firstMultiToolbar = Array.isArray(settings.multi_toolbar)
      ? settings.multi_toolbar[0]
      : undefined

    const globalTheme = createTheme({
      palette: {
        mode: mapThemeType[(settings.theme_base as string) || 'base'],
        primary: {
          main: (settings.theme_primary as string) || '#1769aa',
          contrastText: (settings.theme_primary_contrast as string) || '#fff'
        },
        secondary: {
          main: (settings.theme_secondary as string) || '#ab003c',
          contrastText: (settings.theme_secondary_contrast as string) || '#fff'
        },
        error: {
          main: (settings.theme_error as string) || '#f44336',
          contrastText: (settings.theme_error_contrast as string) || '#fff'
        },
        grey: augmentColor({ color: { main: grey[800] } }),
        ...(settings.body_background_color?.rgba && {
          background: {
            default: settings.body_background_color.rgba
          }
        })
      },
      drawer: {
        left: `${settings.drawer_width || 285}px`,
        right: `${rightDrawerWidth || 254}px`
      },
      toolbar: {
        progressColor: settings.toolbar_progress_color,
        height: {
          mobile: 56,
          landscape: 48,
          desktop: 64,
          custom: settings.toolbar_main_height
            ? settings.toolbar_main_height
            : undefined,
          systemBar: firstMultiToolbar?.is_system_bar
            ? firstMultiToolbar?.height || 40
            : 0
        }
      },
      typography: {
        fontFamily:
          process.env.NEXT_PUBLIC_FONT_DEFAULT ||
          (settings.theme_font_default &&
            (parseFont(settings.theme_font_default) as string))
      },
      alternativeFont: {
        alt1:
          process.env.NEXT_PUBLIC_FONT_ALT1 ||
          (settings.theme_font_alt1 &&
            (parseFont(settings.theme_font_alt1) as string)),
        alt2:
          process.env.NEXT_PUBLIC_FONT_ALT2 ||
          (settings.theme_font_alt2 &&
            (parseFont(settings.theme_font_alt2) as string)),
        alt3:
          process.env.NEXT_PUBLIC_FONT_ALT3 ||
          (settings.theme_font_alt3 &&
            (parseFont(settings.theme_font_alt3) as string)),
        alt4:
          process.env.NEXT_PUBLIC_FONT_ALT4 ||
          (settings.theme_font_alt4 &&
            (parseFont(settings.theme_font_alt4) as string))
      },
      defaultContainerWidth,
      components: {
        MuiDrawer: {
          styleOverrides: {
            modal: {
              '&.lm-main__drawer .MuiExpansionPanelDetails-root .MuiList-root':
                {
                  width: '100%'
                }
            }
          }
        },
        MuiPopover: {
          styleOverrides: {
            paper: {
              '& a': {
                color: 'inherit',
                textDecoration: 'none'
              }
            }
          }
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              '& .MuiToolbar-root, & .MuiContainer-root': {
                height: '100%'
              },

              '& .lm-logo-header': {
                height: '100%',
                display: 'inline-block',
                '&.lm-logo-text': {
                  height: '100%',
                  display: 'inline-flex',
                  alignItems: 'center'
                },
                '& .MuiCollapse-wrapper': {
                  height: '100%'
                }
              },
              '& .MuiButtonBase-root.lm-default-color, & a.lm-logo-header': {
                color: 'inherit',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                '&.MuiButton-outlined,&.lm-outlined': {
                  borderColor: 'currentColor'
                }
              },
              '& .lm-toolbar__section': {
                justifyContent: 'flex-end'
              },
              '&.lm-toolbar__dark': {
                backgroundColor: '#424242',
                color: 'white'
              }
            }
          }
        },
        MuiCard: {
          styleOverrides: {
            root: {
              '& > a': {
                textDecoration: 'none',
                color: 'inherit'
              }
            }
          }
        },
        MuiList: {
          styleOverrides: {
            root: {
              '& > a': {
                color: 'inherit'
              }
            }
          }
        },
        MuiButton: {
          variants: [
            {
              props: { variant: 'contained', color: 'grey' },
              style: {
                color: getContrastText(grey[300])
              }
            },
            {
              props: { variant: 'outlined', color: 'grey' },
              style: {
                color: palette.text.primary,
                borderColor:
                  palette.mode === 'light'
                    ? 'rgba(0, 0, 0, 0.23)'
                    : 'rgba(255, 255, 255, 0.23)',
                '&.Mui-disabled': {
                  border: `1px solid ${palette.action.disabledBackground}`
                },
                '&:hover': {
                  borderColor:
                    palette.mode === 'light'
                      ? 'rgba(0, 0, 0, 0.23)'
                      : 'rgba(255, 255, 255, 0.23)',
                  backgroundColor: alpha(
                    palette.text.primary,
                    palette.action.hoverOpacity
                  )
                }
              }
            },
            {
              props: { color: 'grey', variant: 'text' },
              style: {
                color: palette.text.primary,
                '&:hover': {
                  backgroundColor: alpha(
                    palette.text.primary,
                    palette.action.hoverOpacity
                  )
                }
              }
            }
          ],
          styleOverrides: {
            root: {
              textTransform: 'initial'
            }
          }
        },
        MuiLink: {
          defaultProps: {
            underline: 'hover'
          }
        }
      }
    })

    return responsiveFontSizes(globalTheme, responsiveFontSizeOptions)
  }, [rightDrawerWidth, settings, themeUid])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LmGlobalStyles />
      {children}
    </ThemeProvider>
  )
}
GlobalTheme.displayName = 'GlobalTheme'

export default GlobalTheme
