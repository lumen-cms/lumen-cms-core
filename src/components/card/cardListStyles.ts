import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles'

export const useGridListStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridList: (props: {
      columnCount?: string
      columnCountPhone?: string
      columnCountTablet?: string
      isMasonry?: boolean
    }) => {
      if (!props.isMasonry) {
        const opts: CreateCSSProperties = {
          '& .MuiGridListTile-root': {
            width: `${100 / Number(props.columnCount || 4)}% !important`,
            [theme.breakpoints.only('xs')]: {
              width: `${100 / Number(props.columnCountPhone || 1)}% !important`
            },
            [theme.breakpoints.between('sm', 'md')]: {
              width: `${
                100 / Number(props.columnCountTablet || props.columnCount || 3)
              }% !important`
            }
          }
        }
        return opts
      }
      const opts: CreateCSSProperties = {
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
    },
    masonry: {
      '& img': {
        display: 'block',
        width: '100%',
        height: 'auto'
      },
      '& .MuiGridList-root': {
        display: 'block'
      },
      '& .MuiGridListTile-root': {
        width: 'auto !important',
        breakInside: 'avoid-column',
        position: 'relative'
      }
    }
  })
)
