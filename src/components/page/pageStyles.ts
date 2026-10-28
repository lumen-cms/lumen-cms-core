import { Theme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'

type PageSx = (theme: Theme) => SystemStyleObject<Theme>

export const rightModalSx: SystemStyleObject<Theme> = {
  '&.MuiDrawer-modal .lm-content-space': {
    display: 'none'
  }
}

export const rightDrawerPaperSx: PageSx = (theme) => ({
  width: theme.drawer.right,
  padding: theme.spacing(2)
})

export const contentSx: PageSx = (theme) => ({
  transition: theme.transitions.create(['margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  })
})

export const contentWithRightSx: PageSx = (theme) => ({
  marginRight: theme.drawer.right
})

export const rightMobileSx: Record<string, PageSx> = {
  sm: (theme) => ({
    [theme.breakpoints.only('xs')]: {
      marginRight: '0 !important'
    }
  }),
  md: (theme) => ({
    [theme.breakpoints.down('md')]: {
      marginRight: 0
    }
  }),
  lg: (theme) => ({
    [theme.breakpoints.down('lg')]: {
      marginRight: 0
    }
  })
}

export const leftShiftSx: PageSx = (theme) => ({
  marginLeft: theme.drawer.left,
  transition: theme.transitions.create(['margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  })
})

export const leftMobileSx: Record<string, PageSx> = {
  sm: (theme) => ({
    [theme.breakpoints.only('xs')]: {
      marginLeft: 0
    }
  }),
  md: (theme) => ({
    [theme.breakpoints.down('md')]: {
      marginLeft: 0
    }
  }),
  lg: (theme) => ({
    [theme.breakpoints.down('lg')]: {
      marginLeft: 0
    }
  })
}
