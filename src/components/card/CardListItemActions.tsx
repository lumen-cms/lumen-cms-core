import React from 'react'
import CardActions from '@material-ui/core/CardActions'
import { CardListItemProps } from './cards'
import { LmComponentRender } from '../CoreComponents'

function CardListItemActions({
  options,
  content
}: CardListItemProps): JSX.Element | null {
  const cardActionsBody = content.card_actions_body || []

  if (!cardActionsBody.length) {
    return null
  }
  return (
    <CardActions disableSpacing={!!options.card_actions_disable_spacing}>
      {cardActionsBody.map((blok, i) =>
        LmComponentRender({ content: blok, i })
      )}
    </CardActions>
  )
}

export default CardListItemActions
