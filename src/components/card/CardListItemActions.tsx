import React from 'react'
import CardActions from '@material-ui/core/CardActions'
import { LmComponentRender } from '../CoreComponents'
import { CardListItemProps } from './cardTypes'

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
