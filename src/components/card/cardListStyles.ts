import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import { CreateCSSProperties } from '@mui/styles'

export const COLUMN_COUNT = {
  DESKTOP: 4,
  TABLET: 3,
  PHONE: 1,
  PHONE_MASONRY: 2
}
export const useGridListStyles = makeStyles((theme: Theme) => ({
  gridList: (props: {
    columnCount?: string
    columnCountTablet?: string
    columnCountPhone?: string
    isMasonry?: boolean
  }) => {
    if (!props.isMasonry) {
      const opts: CreateCSSProperties = {
        '& .MuiImageListItem-root': {
          width: `${
            100 / Number(props.columnCount || COLUMN_COUNT.DESKTOP)
          }% !important`,
          [theme.breakpoints.only('xs')]: {
            width: `${
              100 / Number(props.columnCountPhone || COLUMN_COUNT.PHONE)
            }% !important`
          },
          [theme.breakpoints.between('sm', 'lg')]: {
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
      [theme.breakpoints.between('sm', 'lg')]: {
        columnCount: Number(
          props.columnCountTablet || props.columnCount || COLUMN_COUNT.TABLET
        )
      }
    }
    return opts
  },
  masonry: {
    // '& img': {
    //   display: 'block',
    //   width: '100%',
    //   height: 'auto'
    // },
    '& .MuiImageList-root': {
      display: 'block'
    },
    '& .MuiImageListItem-root': {
      width: 'auto !important',
      breakInside: 'avoid-column',
      position: 'relative'
    }
  }
}))
