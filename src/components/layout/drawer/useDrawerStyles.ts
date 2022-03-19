import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  leftDrawer: {
    width: theme.drawer.left,
    '& a': {
      color: 'inherit'
    }
  },
  aboveToolbar: {
    zIndex: theme.zIndex.drawer + 2
  },
  belowToolbar: {
    zIndex: theme.zIndex.appBar - 1
  },
  fullWidthMobile: {
    [theme.breakpoints.only('xs')]: {
      width: '100%'
    }
  }
}))
