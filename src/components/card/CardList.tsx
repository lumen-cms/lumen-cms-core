import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { LmComponentRender } from '@LmComponentRender'
import { LmCardListProps } from './cardTypes'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { CardListStoryblok } from '../../typings/generated/components-schema'
import { makeStyles } from 'tss-react/mui'
import { Grid } from '@mui/material'
import { COLUMN_COUNT } from './cardListStyles'

const useStyles = makeStyles<CardListStoryblok>()((_, content) => ({
  cardBase: {
    overflow: 'visible',
    flexGrow: 1,
    '& .MuiImageListItem-item': {
      overflow: 'visible'
    },
    '&.card__text_align_center .MuiCardMedia-root .MuiCardContent-root': {
      textAlign: 'center'
    },
    '&.card__text_align_right .MuiCardMedia-root .MuiCardContent-root': {
      textAlign: 'right'
    },
    '&.card__text_center .MuiCardMedia-root .MuiCardContent-root': {
      justifyContent: 'center'
    },
    '&.card__text_top_bottom .MuiCardMedia-root .MuiCardContent-root': {
      justifyContent: 'space-between'
    },
    '&.card__text_bottom .MuiCardMedia-root .MuiCardContent-root': {
      justifyContent: 'flex-end'
    },
    '& .MuiCardMedia-root': {
      paddingBottom: '56.25%' // add ratio variants
    },
    '&.ratio-1x1 .MuiCardMedia-root': {
      paddingBottom: '100%' // add ratio variants
    },
    '&.ratio-4x3 .MuiCardMedia-root': {
      paddingBottom: '75%' // add ratio variants
    },
    '&.ratio-3x2 .MuiCardMedia-root': {
      paddingBottom: '66.66%' // add ratio variants
    },
    '&.ratio-2x3 .MuiCardMedia-root': {
      paddingBottom: '150%' // add ratio variants
    },
    '&.ratio-1x3 .MuiCardMedia-root': {
      paddingBottom: '300%' // add ratio variants
    },
    '&.ratio-3x1 .MuiCardMedia-root': {
      paddingBottom: '33.33%' // add ratio variants
    },
    '&.ratio-2.85x1 .MuiCardMedia-root': {
      paddingBottom: '35.09%' // add ratio variants
    },
    '&.card__over_media .MuiCardMedia-root': {
      position: 'relative',

      '& .MuiCardContent-root': {
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    }
  },
  gridCustom: {
    '& .MuiCardMedia-root > div': {
      borderRadius: content.image_border_radius
    }
  }
}))

const chunkSize = 30

export default function LmCardList({
  content,
  disablePagination
}: LmCardListProps): JSX.Element {
  const { body = [], ...rest } = content
  const { classes, cx: clsx } = useStyles(rest)
  const gutterSize = content.column_gap ? Number(content.column_gap) : 24
  const enableInView = !disablePagination && body.length > chunkSize
  const [intersectionLoadMoreRef, loadMoreInView] = useInView()
  const [inViewRef, elementInView] = useInView(intersectionDefaultOptions)
  const [page, setPage] = useState<number>(1)
  const data =
    (!disablePagination ? body.slice(0, page * chunkSize) : body) || []

  useEffect(() => {
    if (!disablePagination && loadMoreInView) {
      setPage((v) => v + 1)
    }
  }, [disablePagination, loadMoreInView, setPage])

  const variant = content.variant || []

  return (
    <div
      ref={inViewRef}
      style={{
        padding: `${gutterSize / 2}px`
      }}
      className={clsx(
        classes.cardBase,
        classes.gridCustom,
        variant.map((i) => `card__${i}`),
        {
          [`ratio-${content.image_ratio}`]: !!content.image_ratio
        }
      )}
    >
      <Grid
        container
        wrap={'wrap'}
        spacing={gutterSize + 'px'}
        columns={[
          Number(content.column_count_phone || COLUMN_COUNT.PHONE),
          Number(content.column_count_tablet || COLUMN_COUNT.TABLET),
          null,
          Number(content.column_count || COLUMN_COUNT.DESKTOP)
        ]}
        justifyContent={'center'}
        sx={{
          '& .MuiGrid-item > .MuiCard-root, & .MuiGrid-item > .MuiCard-root > .MuiCardActionArea-root':
            {
              height: content.variant?.includes('equal-heights')
                ? '100%'
                : 'auto'
            }
        }}
      >
        {data.map((item) => (
          <Grid item key={`${item.component}_${item._uid}`} xs={1}>
            <LmComponentRender
              content={item}
              options={rest}
              inView={elementInView}
            />
          </Grid>
        ))}
      </Grid>
      {/*<ImageList*/}
      {/*  gap={gutterSize}*/}
      {/*  rowHeight="auto"*/}
      {/*  sx={{*/}
      {/*    overflow: 'visible',*/}
      {/*    columnCount: {*/}
      {/*      xs: `${*/}
      {/*        content.column_count_phone || COLUMN_COUNT.PHONE_MASONRY*/}
      {/*      }!important`,*/}
      {/*      sm: `${*/}
      {/*        content.column_count_tablet || COLUMN_COUNT.TABLET*/}
      {/*      }!important`,*/}
      {/*      lg: `${content.column_count || COLUMN_COUNT.DESKTOP}!important`*/}
      {/*    }*/}
      {/*  }}*/}
      {/*  // className={gridClasses.root}*/}
      {/*  variant={'masonry'}*/}
      {/*>*/}
      {/*  {data.map((item) => (*/}
      {/*    <ImageListItem key={`${item.component}_${item._uid}`}>*/}
      {/*      <LmComponentRender*/}
      {/*        content={item}*/}
      {/*        options={rest}*/}
      {/*        inView={elementInView}*/}
      {/*      />*/}
      {/*    </ImageListItem>*/}
      {/*  ))}*/}
      {/*</ImageList>*/}
      <div
        ref={
          enableInView && data.length < body.length
            ? intersectionLoadMoreRef
            : undefined
        }
      />
    </div>
  )
}
