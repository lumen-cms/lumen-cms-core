import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import { useInView } from 'react-intersection-observer'
import { useGridListStyles } from './cardListStyles'
import { LmComponentRender } from '@LmComponentRender'
import { LmCardListProps } from './cardTypes'

const useStyles = makeStyles({
  cardBase: {
    overflow: 'visible',
    flexGrow: 1,
    '& .MuiGridListTile-tile': {
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
  }
})

const chunkSize = 30

export function LmCardList({ content }: LmCardListProps): JSX.Element {
  const { body = [], ...rest } = content
  const classes = useStyles(content)
  const gridClasses = useGridListStyles({
    columnCount: content.column_count,
    columnCountPhone: content.column_count_phone,
    columnCountTablet: content.column_count_tablet
  })
  const gutterSize = content.column_gap ? Number(content.column_gap) : 24
  const enableInView = body.length > chunkSize
  const [intersectionRef, inView] = useInView()

  // const [data, setData] = useState<CardListItemStoryblok[]>(
  //   body.slice(0, chunkSize) || []
  // )
  const [page, setPage] = useState<number>(1)

  const data = body.slice(0, page * chunkSize) || []

  useEffect(() => {
    if (inView) {
      setPage((v) => v + 1)
    }
  }, [inView, setPage])

  // useEffect(() => {
  //   if (page > 0) {
  //     setData((v) => [
  //       ...v,
  //       ...body.slice(page * chunkSize, (page + 1) * chunkSize)
  //     ])
  //   }
  // }, [page, setData, body])

  const variant = content.variant || []

  return (
    <div
      style={{
        padding: `${gutterSize / 2}px`
      }}
      className={clsx(
        classes.cardBase,
        variant.map((i) => `card__${i}`),
        {
          [`ratio-${content.image_ratio}`]: content.image_ratio
        }
      )}
    >
      <GridList
        spacing={gutterSize}
        cellHeight="auto"
        style={{
          overflow: 'visible'
        }}
        className={gridClasses.gridList}
      >
        {data.map((item) => (
          <GridListTile key={`${item.component}_${item._uid}`}>
            <LmComponentRender content={item} options={rest} />
          </GridListTile>
        ))}
      </GridList>
      <div
        ref={
          enableInView && data.length < body.length
            ? intersectionRef
            : undefined
        }
      />
    </div>
  )
}
