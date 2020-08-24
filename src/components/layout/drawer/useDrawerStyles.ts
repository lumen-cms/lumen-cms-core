import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    leftDrawer: {
      width: theme.drawer.left,
      '& a': {
        color: 'inherit',
      },
    },
    aboveToolbar: {
      zIndex: theme.zIndex.drawer + 2,
    },
    belowToolbar: {
      zIndex: theme.zIndex.appBar - 1,
    },
    fullWidthMobile: {
      [theme.breakpoints.only('xs')]: {
        width: '100%',
      },
    },
  })
)
