import { Theme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'

export const leftDrawerSx = (theme: Theme): SystemStyleObject<Theme> => ({
  width: theme.drawer.left,
  '& a': {
    color: 'inherit'
  }
})

export const aboveToolbarSx = (theme: Theme): SystemStyleObject<Theme> => ({
  zIndex: theme.zIndex.drawer + 2
})

export const belowToolbarSx = (theme: Theme): SystemStyleObject<Theme> => ({
  zIndex: theme.zIndex.appBar - 1
})

export const fullWidthMobileSx = (theme: Theme): SystemStyleObject<Theme> => ({
  [theme.breakpoints.only('xs')]: {
    width: '100%'
  }
})
