import clsx from 'clsx'
import React from 'react'
import { CardListStoryblok } from '../../typings/generated/components-schema'
import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import { useGridListStyles } from './cardListStyles'
import { useInfiniteScroll } from '../../utils/hooks/useInfiniteScroll'
import { useAppContext } from '../provider/AppProvider'

const useStyles = makeStyles({
    cardBase: {
      overflowX: 'hidden',
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
  }
)


export type LmCardListProps = { content: CardListStoryblok }

export function LmCardList({ content }: LmCardListProps): JSX.Element {
  const { ComponentRender } = useAppContext()

  const { body, column_gap, column_count, column_count_phone, column_count_tablet, ...rest } = content
  const classes = useStyles(content)
  const gridClasses = useGridListStyles({
    columnCount: content.column_count,
    columnCountPhone: content.column_count_phone,
    columnCountTablet: content.column_count_tablet
  })
  let gutterSize = content.column_gap ? Number(content.column_gap) : 24

  const { ref, data, hasMore } = useInfiniteScroll(body || [])
  const variant = content.variant || []

  return (
    <div
      style={{
        padding: `${gutterSize / 2}px`
      }}
      className={clsx(classes.cardBase, variant.map(i => 'card__' + i), {
        ['ratio-' + content.image_ratio]: content.image_ratio
      })}>
      <GridList spacing={gutterSize}
                cellHeight={'auto'}
                className={gridClasses.gridList}>
        {data.map((item, i) => <GridListTile key={`${item.component}_${i}`}>{ComponentRender({
          content: item,
          options: rest
        })}</GridListTile>)}
      </GridList>
      <div ref={hasMore ? ref : undefined}></div>
    </div>
  )
}
