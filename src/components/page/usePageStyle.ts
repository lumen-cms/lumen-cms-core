import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'


export const usePageStyles = makeStyles((theme: Theme) => createStyles({
  rightDocked: {
    width: theme.drawer.right,
    zIndex: theme.zIndex.appBar - 1
  },
  rightModal: {
    '& .lm-content-space': {
      display: 'none'
    }
  },
  rightDrawerPaper: {
    width: theme.drawer.right,
    padding: theme.spacing(2)
  },
  rightContent: {
    overflowY: 'auto'
  },
  content: {
    transition: theme.transitions.create(['margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  contentWithRight: {
    marginRight: theme.drawer.right,
  },
  'right-mobile-sm': {
    [theme.breakpoints.only('xs')]: {
      marginRight: '0 !important'
    }
  },
  'right-mobile-md': {
    [theme.breakpoints.down('sm')]: {
      marginRight: 0
    }
  },
  'right-mobile-lg': {
    [theme.breakpoints.down('md')]: {
      marginRight: 0
    }
  },
  leftShift: {
    marginLeft: theme.drawer.left,
    transition: theme.transitions.create(['margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  'left-mobile-sm': {
    [theme.breakpoints.only('xs')]: {
      marginLeft: 0
    }
  },
  'left-mobile-md': {
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0
    }
  },
  'left-mobile-lg': {
    [theme.breakpoints.down('md')]: {
      marginLeft: 0
    }
  },
}))
