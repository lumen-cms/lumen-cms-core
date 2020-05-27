import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles'

export const useGridListStyles = makeStyles((theme: Theme) => createStyles({
  gridList: (props: { columnCount?: string, columnCountPhone?: string, columnCountTablet?: string, isMasonry?: boolean }) => {
    if (!props.isMasonry) {
      const opts: CreateCSSProperties<{}> = {
        '& .MuiGridListTile-root': {
          width: `${(100 / Number(props.columnCount || 4)) * 1}% !important`,
          [theme.breakpoints.only('xs')]: {
            width: `${(100 / Number(props.columnCountPhone || 1)) * 1}% !important`
          }
        }
      }
      if (props.columnCountTablet) {
        opts[theme.breakpoints.between('sm', 'md')] = {
          '& .MuiGridListTile-root': {
            width: `${(100 / Number(props.columnCountTablet)) * 1}% !important`
          }
        }
      }
      return opts
    } else {
      const opts: CreateCSSProperties<{}> = {
        columnCount: Number(props.columnCount || 4),
        [theme.breakpoints.only('xs')]: {
          columnCount: Number(props.columnCountPhone || 2)
        }
      }

      if (props.columnCountTablet) {
        opts[theme.breakpoints.between('sm', 'md')] = {
          columnCount: Number(props.columnCountTablet)
        }
      }
      return opts
    }
  }
}))
