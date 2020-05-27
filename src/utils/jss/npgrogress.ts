import { Theme } from '@material-ui/core/styles'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

const getNprogressJss = (theme: Theme): CSSProperties => ({
  // NProgress
  '#nprogress': {
    pointerEvents: 'none',
    '& .bar': {
      position: 'fixed',
      background: (theme.toolbar && theme.toolbar.progressColor) ? theme.toolbar.progressColor : theme.palette.primary.main,
      borderRadius: 0,
      zIndex: theme.zIndex.tooltip,
      top: 0,
      left: 0,
      width: '100%',
      height: 2
    },
    '& dd, & dt': {
      position: 'absolute',
      top: 0,
      height: 2,
      boxShadow: `${(theme.toolbar && theme.toolbar.progressColor) || theme.palette.primary.main} 1px 0 6px 1px`,
      borderRadius: '100%',
      animation: 'nprogress-pulse 2s ease-out 0s infinite'
    },
    '& dd': {
      opacity: 0.6,
      width: 20,
      right: 0,
      clip: 'rect(-6px,22px,14px,10px)'
    },
    '& dt': {
      opacity: 0.6,
      width: 180,
      right: -80,
      clip: 'rect(-6px,90px,14px,-6px)'
    }
  },
  '@keyframes nprogress-pulse': {
    '30%': {
      opacity: 0.6
    },
    '60%': {
      opacity: 0
    },
    to: {
      opacity: 0.6
    }
  }
})
export default getNprogressJss
