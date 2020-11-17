import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles'

export const COLUMN_COUNT = {
  DESKTOP: 4,
  TABLET: 3,
  PHONE: 1,
  PHONE_MASONRY: 2
}
export const useGridListStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridList: (props: {
      columnCount?: string
      columnCountTablet?: string
      columnCountPhone?: string
      isMasonry?: boolean
    }) => {
      if (!props.isMasonry) {
        const opts: CreateCSSProperties = {
          '& .MuiGridListTile-root': {
            width: `${
              100 / Number(props.columnCount || COLUMN_COUNT.DESKTOP)
            }% !important`,
            [theme.breakpoints.only('xs')]: {
              width: `${
                100 / Number(props.columnCountPhone || COLUMN_COUNT.PHONE)
              }% !important`
            },
            [theme.breakpoints.between('sm', 'md')]: {
              width: `${
                100 /
                Number(
                  props.columnCountTablet ||
                    props.columnCount ||
                    COLUMN_COUNT.TABLET
                )
              }% !important`
            }
          }
        }
        return opts
      }
      const opts: CreateCSSProperties = {
        columnCount: Number(props.columnCount || COLUMN_COUNT.DESKTOP),
        [theme.breakpoints.only('xs')]: {
          columnCount: Number(
            props.columnCountPhone || COLUMN_COUNT.PHONE_MASONRY
          )
        },
        [theme.breakpoints.between('sm', 'md')]: {
          columnCount: Number(
            props.columnCountTablet || props.columnCount || COLUMN_COUNT.TABLET
          )
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
