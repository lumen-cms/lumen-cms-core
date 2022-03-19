import { makeStyles } from 'tss-react/mui'

export const COLUMN_COUNT = {
  DESKTOP: 4,
  TABLET: 3,
  PHONE: 1,
  PHONE_MASONRY: 2
}
type UseGridListProps = {
  columnCount?: string
  columnCountTablet?: string
  columnCountPhone?: string
  isMasonry?: boolean
}
export const useGridListStyles = makeStyles<UseGridListProps>()(
  (theme, { columnCount, columnCountPhone, columnCountTablet }) => ({
    root: {
      '& .MuiImageListItem-root': {
        width: `${
          100 / Number(columnCount || COLUMN_COUNT.DESKTOP)
        }% !important`,
        [theme.breakpoints.only('xs')]: {
          width: `${
            100 / Number(columnCountPhone || COLUMN_COUNT.PHONE)
          }% !important`
        },
        [theme.breakpoints.between('sm', 'lg')]: {
          width: `${
            100 /
            Number(columnCountTablet || columnCount || COLUMN_COUNT.TABLET)
          }% !important`
        }
      }
    },
    rootMasonry: {
      columnCount: Number(columnCount || COLUMN_COUNT.DESKTOP),
      [theme.breakpoints.only('xs')]: {
        columnCount: Number(columnCountPhone || COLUMN_COUNT.PHONE_MASONRY)
      },
      [theme.breakpoints.between('sm', 'lg')]: {
        columnCount: Number(
          columnCountTablet || columnCount || COLUMN_COUNT.TABLET
        )
      }
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
  })
)
