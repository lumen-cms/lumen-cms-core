import { alpha, createTheme, ThemeProvider } from '@mui/material/styles'
import { FunctionComponent, PropsWithChildren, useMemo } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { responsiveFontSizesCompatible as responsiveFontSizes } from '../../utils/responsiveFontSizes'
import parseFont from '../../utils/parseFontName'
import { LmGlobalStyles } from './LmGlobalStyles'
import type { ThemeConfig } from './themeConfig'
import { grey } from '@mui/material/colors'
import { Color } from '@mui/material'
type ResponsiveFontSizesOptions = NonNullable<
  Parameters<typeof responsiveFontSizes>[1]
>

declare module '@mui/material/styles' {
  interface Palette {
    grey: Color
  }
}

declare module '@mui/material/Fab' {
  interface FabPropsColorOverrides {
    grey: true
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
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

declare module '@mui/material/styles' {
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

const mapThemeType: Record<string, 'light' | 'dark' | undefined> = {
  base: 'light',
  dark: 'dark'
}
const responsiveFontSizeOptions: ResponsiveFontSizesOptions = {
  breakpoints: ['sm', 'md', 'lg'],
  factor: 2 // default 2
}

const { palette } = createTheme()
const { augmentColor, getContrastText } = palette

export const ConfiguredGlobalTheme: FunctionComponent<
  PropsWithChildren<{ config: ThemeConfig }>
> = ({ children, config: settings }) => {
  const rightDrawerWidth = settings.rightDrawerWidth
  const themeUid = settings && settings._uid
  const theme = useMemo(() => {
    if (!themeUid) {
      return responsiveFontSizes(createTheme(), responsiveFontSizeOptions)
    }

    let defaultContainerWidth: string | boolean = 'lg'
    if (settings.theme_container_width) {
      defaultContainerWidth =
        settings.theme_container_width === 'none'
          ? false
          : settings.theme_container_width
    }

    const globalTheme = createTheme({
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 900, //
          lg: 1280, //1200, //
          xl: 1920 //1536 //
        }
      },
      palette: {
        ...(settings.default_font_color && {
          text: {
            primary: settings.default_font_color
          }
        }),
        mode: mapThemeType[(settings.theme_base as string) || 'base'],
        primary: {
          main: settings.theme_primary || '#1769aa',
          contrastText: settings.theme_primary_contrast || '#fff'
        },
        secondary: {
          main: settings.theme_secondary || '#ab003c',
          contrastText: settings.theme_secondary_contrast || '#fff'
        },
        error: {
          main: settings.theme_error || '#f44336',
          contrastText: settings.theme_error_contrast || '#fff'
        },
        success: {
          main: settings.theme_success || '#2e7d32',
          contrastText: settings.theme_success_contrast || '#fff'
        },
        info: {
          main: settings.theme_info || '#0288d1',
          contrastText: settings.theme_info_contrast || '#fff'
        },
        warning: {
          main: settings.theme_warning || '#ed6c02',
          contrastText: settings.theme_warning_contrast || '#fff'
        },
        grey: augmentColor({ color: { main: grey[300] } }),
        ...(settings.bodyBackgroundColor && {
          background: {
            default: settings.bodyBackgroundColor
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
            ? Number(settings.toolbar_main_height)
            : undefined,
          systemBar: settings.systemBarHeight
        }
      },
      typography: {
        fontFamily:
          process.env.NEXT_PUBLIC_FONT_DEFAULT ||
          (parseFont(
            settings.theme_font_default ||
              'Nunito:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700'
          ) as string)
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
        // Preserve the icon gutter used by existing CMS navigation layouts.
        MuiListItemIcon: { styleOverrides: { root: { minWidth: 56 } } },
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
        MuiGrid: {},
        MuiGrid2: {
          defaultProps: {
            disableEqualOverflow: false
          },
          styleOverrides: {
            root: {
              '&.MuiGrid2-container.lm-grid__row .MuiGrid2-container.lm-grid__row':
                {
                  padding: 0
                },
              '&.MuiGrid2-container': {
                flexGrow: 1,
                '& > div[class*="-auto"]': {
                  maxWidth: '100%'
                }
                // width: '100%'
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
  }, [
    rightDrawerWidth,
    themeUid,
    settings.theme_container_width,
    settings.default_font_color,
    settings.theme_base,
    settings.theme_primary,
    settings.theme_primary_contrast,
    settings.theme_secondary,
    settings.theme_secondary_contrast,
    settings.theme_error,
    settings.theme_error_contrast,
    settings.theme_success,
    settings.theme_success_contrast,
    settings.theme_info,
    settings.theme_info_contrast,
    settings.theme_warning,
    settings.theme_warning_contrast,
    settings.drawer_width,
    settings.toolbar_progress_color,
    settings.toolbar_main_height,
    settings.theme_font_default,
    settings.theme_font_alt1,
    settings.theme_font_alt2,
    settings.theme_font_alt3,
    settings.theme_font_alt4,
    settings.bodyBackgroundColor,
    settings.systemBarHeight
  ])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LmGlobalStyles />
      {children}
    </ThemeProvider>
  )
}
ConfiguredGlobalTheme.displayName = 'ConfiguredGlobalTheme'

export default ConfiguredGlobalTheme
