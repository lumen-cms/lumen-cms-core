import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import getNprogressJss from '../jss/npgrogress'


export const getCreatedStyles = (theme: Theme) => {
  const genSpacing = (breakpoint: string = '') => {
    const spacing = {}
    const directions = [{ key: 't', val: 'Top' }, { key: 'l', val: 'Left' }, { key: 'r', val: 'Right' }, {
      key: 'b',
      val: 'Bottom'
    }]
    for (let i = 0; i <= 5; i++) {
      for (const dir of directions) {
        spacing[`.p${dir.key}${breakpoint}-${i}`] = {
          [`padding${dir.val}`]: `${theme.spacing(i)}px !important`
        }
        spacing[`.m${dir.key}${breakpoint}-${i}`] = {
          [`margin${dir.val}`]: `${theme.spacing(i)}px !important`
        }
        spacing[`.p${breakpoint}-${i}`] = {
          [`padding`]: `${theme.spacing(i)}px !important`
        }
        spacing[`.m${breakpoint}-${i}`] = {
          [`margin`]: `${theme.spacing(i)}px !important`
        }
        spacing[`.mx${breakpoint}-${i}`] = {
          [`marginLeft`]: `${theme.spacing(i)}px !important`,
          [`marginRight`]: `${theme.spacing(i)}px !important`
        }
        spacing[`.my${breakpoint}-${i}`] = {
          [`marginTop`]: `${theme.spacing(i)}px !important`,
          [`marginBottom`]: `${theme.spacing(i)}px !important`
        }
        spacing[`.px${breakpoint}-${i}`] = {
          [`paddingLeft`]: `${theme.spacing(i)}px !important`,
          [`paddingRight`]: `${theme.spacing(i)}px !important`
        }
        spacing[`.py${breakpoint}-${i}`] = {
          [`paddingTop`]: `${theme.spacing(i)}px !important`,
          [`paddingBottom`]: `${theme.spacing(i)}px !important`
        }
      }
    }
    return spacing
  }

  // const spacing = genSpacing()

  const dark = '#303030'

  return createStyles({
    '@global': {
      ...getNprogressJss(theme),
      ...genSpacing(),
      '.img-fluid': {
        maxWidth: '100%',
        height: 'auto'
      },
      'a': {
        textDecoration: 'none'
      },
      '.badge': {
        display: 'inline-block',
        padding: '.25em .4em',
        backgroundColor: theme.palette.type === 'dark' ? '#f5f5f5' : dark,
        color: theme.palette.type === 'dark' ? 'rgba(0, 0, 0, 0.87)' : theme.palette.common.white,
        borderRadius: theme.shape.borderRadius,
        transform: '225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      },
      '.badge-pill': {
        display: 'inline-block',
        padding: '.25em .4em',
        backgroundColor: theme.palette.type === 'dark' ? '#f5f5f5' : dark,
        color: theme.palette.type === 'dark' ? 'rgba(0, 0, 0, 0.87)' : theme.palette.common.white,
        transform: '225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        borderRadius: '2rem'
      },
      '.badge-square': {
        display: 'inline-block',
        padding: '.25em .4em',
        backgroundColor: theme.palette.type === 'dark' ? '#f5f5f5' : dark,
        color: theme.palette.type === 'dark' ? 'rgba(0, 0, 0, 0.87)' : theme.palette.common.white,
        transform: '225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      },
      '.badge-primary': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
      },
      '.badge-secondary': {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText
      },
      '.badge-danger': {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText
      },
      '.badge-light': {
        backgroundColor: '#ccc',
        color: 'rgba(0, 0, 0, 0.87)'
      },
      '.badge-dark': {
        backgroundColor: dark,
        color: '#fff'
      },
      '.badge-dark-transparent': {
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#fff'
      },
      '.badge-light-transparent': {
        backgroundColor: 'rgba(0,0,0,0.2)',
        color: 'rgba(0, 0, 0, 0.87)'
      },
      '.embed-responsive': {
        position: 'relative',
        display: 'block',
        width: '100%',
        padding: 0,
        overflow: 'hidden',
        '&.embed-responsive-16by9': {
          paddingBottom: '56.25%'
        },
        '&.embed-responsive-4by3': {
          paddingBottom: '75%'
        },
        '&.embed-responsive-1by1': {
          paddingBottom: '100%'
        },
        '&.embed-responsive-3by2': {
          paddingBottom: '66.6%'
        }
      },
      '.embed-responsive-item': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 0
      },
      // '.material-icons': {
      //   visibility: 'hidden'
      // },
      '.line-through': {
        textDecoration: 'line-through'
      },
      // '.fonts-loaded': {
      //   '& .material-icons': {
      //     visibility: 'visible'
      //   }
      // },
      '.mh-100': {
        minHeight: '100% !important'
      },
      '.h-100': {
        height: '100% !important'
      },
      '.mw-100': {
        minWidth: '100% !important'
      },
      '.w-100': {
        width: '100% !important'
      },
      '.text-left': {
        textAlign: 'left'
      },
      '.text-center': {
        textAlign: 'center'
      },
      '.text-right': {
        textAlign: 'right'
      },
      '.text-justify': {
        textAlign: 'justify'
      },
      '.font-weight-bold': {
        fontWeight: 'bold !important'
      },
      '.font-weight-bolder': {
        fontWeight: 'bolder !important'
      },
      '.font-weight-light': {
        fontWeight: 'light !important'
      },
      '.font-weight-lighter': {
        fontWeight: 'lighter !important'
      },
      '.font-weight-normal': {
        fontWeight: 'normal !important'
      },
      '.font-weight-100': {
        fontWeight: '100 !important'
      },
      '.font-weight-200': {
        fontWeight: '200 !important'
      },
      '.font-weight-300': {
        fontWeight: '300 !important'
      },
      '.font-weight-400': {
        fontWeight: '400 !important'
      },
      '.font-weight-500': {
        fontWeight: '500 !important'
      },
      '.font-weight-600': {
        fontWeight: '600 !important'
      },
      '.font-weight-700': {
        fontWeight: '700 !important'
      },
      '.font-weight-800': {
        fontWeight: '800 !important'
      },
      '.font-weight-900': {
        fontWeight: '900 !important'
      },
      '.text-uppercase': {
        textTransform: 'uppercase'
      },
      '.text-monospace': {
        fontFamily: 'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace !important'
      },
      '.font-italic': {
        fontStyle: 'italic !important'
      },
      '.text-primary': {
        color: `${theme.palette.primary.main} !important`
      },
      '.text-black-50': {
        color: 'rgba(0,0,0,0.5) !important'
      },
      '.text-white-50': {
        color: 'rgba(255,255,255,0.5) !important'
      },
      '.text-secondary': {
        color: `${theme.palette.secondary.main} !important`
      },
      '.text-primary-text': {
        color: `${theme.palette.text.primary} !important`
      },
      '.text-primary-secondary': {
        color: `${theme.palette.text.secondary} !important`
      },
      '.text-muted': {
        color: `${theme.palette.text.hint} !important`
      },
      '.text-white': {
        color: `${theme.palette.common.white} !important`
      },
      '.text-danger': {
        color: `${theme.palette.error.main} !important`
      },
      '.bg-primary': {
        backgroundColor: `${theme.palette.primary.main} !important`
      },
      '.bg-secondary': {
        backgroundColor: `${theme.palette.secondary.main} !important`
      },
      '.bg-danger': {
        backgroundColor: `${theme.palette.error.main} !important`
      },
      '.bg-white': {
        backgroundColor: `${theme.palette.common.white} !important`
      },
      '.bg-black': {
        backgroundColor: theme.palette.common.black
      },
      '.bg-dark': {
        backgroundColor: `${dark}!important`
      },
      '.bg-light': {
        backgroundColor: '#ccc !important'
      },
      'a.lm-link__button': {
        textDecoration: 'none',
        color: 'inherit'
      },
      '.lm-font-alt1': {
        fontFamily: (theme.alternativeFont && theme.alternativeFont.alt1) || theme.typography.fontFamily
      },
      '.lm-font-alt2': {
        fontFamily: (theme.alternativeFont && theme.alternativeFont.alt2) || theme.typography.fontFamily
      },
      '.lm-font-alt3': {
        fontFamily: (theme.alternativeFont && theme.alternativeFont.alt3) || theme.typography.fontFamily
      },
      '.lm-font-alt4': {
        fontFamily: (theme.alternativeFont && theme.alternativeFont.alt4) || theme.typography.fontFamily
      },
      '.d-none': {
        display: 'none'
      },
      '.d-inline-flex': {
        display: 'inline-flex'
      },
      '.d-block': {
        display: 'block'
      },
      '.d-inline-block': {
        display: 'inline-block'
      },
      '.text-1-row-max': {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      },
      '.text-2-rows-max': {
        display: '-webkit-box',
        textOverflow: 'ellipsis',
        minHeight: '3rem',
        overflow: 'hidden',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': 2
      },
      '.text-3-rows-max': {
        display: '-webkit-box',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        minHeight: '4.5rem',
        '-webkit-line-clamp': 3,
        '-webkit-box-orient': 'vertical'
      },
      [theme.breakpoints.only('xs')]:
        {
          '.d-xs-inline-flex':
            {
              display: 'inline-flex'
            }
          ,
          '.d-xs-none':
            {
              display: 'none'
            }
          ,
          '.d-xs-block':
            {
              display: 'block'
            }
        }
      ,
      [theme.breakpoints.up('sm')]:
        {
          '.d-sm-inline-flex':
            {
              display: 'inline-flex'
            }
          ,
          '.d-sm-none':
            {
              display: 'none'
            }
          ,
          '.d-sm-block':
            {
              display: 'block'
            }
          ,
          '.text-sm-left':
            {
              textAlign: 'left'
            }
          ,
          '.text-sm-center':
            {
              textAlign: 'center'
            }
          ,
          '.text-sm-right':
            {
              textAlign: 'right'
            }
          ,
          '.text-sm-justify':
            {
              textAlign: 'justify'
            }
          ,
          ...
            genSpacing('-sm')
        }
      ,
      [theme.breakpoints.up('md')]:
        {
          '.d-md-inline-flex':
            {
              display: 'inline-flex'
            }
          ,
          '.d-md-none':
            {
              display: 'none'
            }
          ,
          '.d-md-block':
            {
              display: 'block'
            }
          ,
          '.text-md-left':
            {
              textAlign: 'left'
            }
          ,
          '.text-md-center':
            {
              textAlign: 'center'
            }
          ,
          '.text-md-right':
            {
              textAlign: 'right'
            }
          ,
          '.text-md-justify':
            {
              textAlign: 'justify'
            }
          ,
          ...
            genSpacing('-md')
        }
      ,
      [theme.breakpoints.up('lg')]:
        {
          '.d-lg-inline-flex':
            {
              display: 'inline-flex'
            }
          ,
          '.d-lg-none':
            {
              display: 'none'
            }
          ,
          '.text-lg-left':
            {
              textAlign: 'left'
            }
          ,
          '.text-lg-center':
            {
              textAlign: 'center'
            }
          ,
          '.text-lg-right':
            {
              textAlign: 'right'
            }
          ,
          '.text-lg-justify':
            {
              textAlign: 'justify'
            }
        }
    }
  })
}

const useGlobalStyles = makeStyles((theme: Theme) => {
  return getCreatedStyles(theme)
})

export default useGlobalStyles
