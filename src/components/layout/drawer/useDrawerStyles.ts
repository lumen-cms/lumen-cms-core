import { Theme } from '@mui/material/styles';

import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
)
